import json
import logging
import os
import re
import time
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pylsl import StreamInfo, StreamOutlet, pylsl
from starlette.requests import Request

from backend.talk_to_pro_lab import tobii_manager

current_session_active = False
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

outlet = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global outlet

    # Startup
    logger.info("Application starting up...")
    info = StreamInfo("Frontend Events", "Markers", 1, 0, "string", "frontend")
    outlet = StreamOutlet(info)
    print("✅  LSL outlet ready — Ready to send data.")

    yield

    # Shutdown
    logger.info("Application shutting down...")
    global current_session_active
    if current_session_active:
        tobii_manager.stop_recording()
    tobii_manager.cleanup()
    logger.info("Application shutdown complete")


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

output_dir = Path("C:/Users/Nosch/Desktop/wanderlust/output")
participantName = "unknown"


@app.get("/")
async def hello():
    return {"message": "Hello"}


@app.get("/create-participant/{custom_participant_number}")
async def get_next_participant(custom_participant_number: Optional[int] = None):
    """Generate the next participant index and name, create a folder for them."""

    # Read all folder names
    output_dir.mkdir(exist_ok=True)
    dirnames = {
        d for d in os.listdir(output_dir) if os.path.isdir(os.path.join(output_dir, d))
    }
    # Extract numbers from folder names that start with digits
    numbers = set()
    for d in dirnames:
        match = re.match(r"^(\d+)", d)
        if match:
            numbers.add(int(match.group(1)))

    print(f"📂 Found {len(dirnames)} folder(s) in '{output_dir}'")
    print(f"🔢 Total participant folders: {sorted(dirnames)}")
    print(f"🔣 Valid participant numbers: {sorted(numbers)}")
    print(f"✅ Valid participants so far: {len(numbers)}")

    if custom_participant_number is not None and custom_participant_number > 0:
        next_number = custom_participant_number
        custom_base = str(custom_participant_number).zfill(3)
        if custom_base not in dirnames:
            print(f"🆕 Using custom participant index: {custom_base}")
            next_name = custom_base
        else:
            # Try suffixes a-z
            for suffix in "abcdefghijklmnopqrstuvwxyz":
                candidate = f"{custom_base}{suffix}"
                if candidate not in dirnames:
                    next_name = candidate
                    print(f"↩️ Custom index in use. Reusing as: {next_name}")
                    break
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"❌ All suffixes taken for participant {custom_base}",
                )
    else:
        # Find the next available index
        sorted_numbers = sorted(numbers)
        next_number = 1
        for num in sorted_numbers:
            if num != next_number:
                break
            next_number += 1
        next_name = str(next_number).zfill(3)
        print(f"✅ Assigned next participant name: {next_name}")

    # Create the participant folder
    folder_path = os.path.join(output_dir, next_name)
    os.makedirs(folder_path, exist_ok=True)
    print(f"📁 Created participant folder: {folder_path}")
    global participantName
    participantName = next_name

    return {"pNumber": next_number, "pName": next_name}


@app.post("/store-json/{participant}/{filename_suffix}")
async def store_json(data: dict, participant: str, filename_suffix: str):
    print("Storing data")
    try:
        datetime_string = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        folder = os.path.join(output_dir, participant)
        os.makedirs(folder, exist_ok=True)
        filename = os.path.join(folder, f"{datetime_string}_{filename_suffix}.json")
        print(f"Storing data in {filename}")

        with open(filename, "w") as file:
            json.dump(data, file, indent=2)

        return {"message": f"Data stored successfully in file: {filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing data: {str(e)}")


@app.get("/{participant}/{site}/{design}/{event}/{route_or_event_phase:path}")
async def get_event(
    request: Request,
    participant: str,
    site: str,
    design: str,
    event: str,
    route_or_event_phase: str,
):
    global participantName
    if participant != participantName:
        print(f"⚠️  Participant mismatch: expected {participantName}, got {participant}")

    full_path = request.url.path
    if request.url.query:
        full_path += f"?{request.url.query}"

    # Push the full path to the LSL stream
    outlet.push_sample([full_path], pylsl.local_clock())
    print(f"Pushed {full_path}")

    if event != "routeChange":
        route_or_event_phase = route_or_event_phase.split("/")[0]

    tobii_marker = f"{design}/{event}/{route_or_event_phase}"
    tobii_manager.send_event(participant, tobii_marker)

    return {"message": f"[BE] Pushed {full_path} to stream."}


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = []
        self.active_connections[channel].append(websocket)
        print(f"Client connected to channel '{channel}'")

    def disconnect(self, websocket: WebSocket, channel: str):
        if (
            channel in self.active_connections
            and websocket in self.active_connections[channel]
        ):
            self.active_connections[channel].remove(websocket)
            if not self.active_connections[channel]:
                del self.active_connections[channel]
            print(f"Client disconnected from channel '{channel}'")

    async def broadcast(self, message: dict, channel: str):
        if channel in self.active_connections:
            for connection in self.active_connections[channel]:
                await connection.send_text(json.dumps(message))
            print(f"Broadcasted to channel '{channel}': {message}")


connection_manager = ConnectionManager()


# WebSocket endpoint
@app.websocket("/ws/{channel}")
async def websocket_endpoint(websocket: WebSocket, channel: str):
    await connection_manager.connect(websocket, channel)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await connection_manager.broadcast(message, channel)
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket, channel)
    except Exception as e:
        print(f"WebSocket error: {e}")
        connection_manager.disconnect(websocket, channel)


# Recording control endpoints
@app.get("/tobii/start/{participant_id}")
async def start_recording(participant_id: str):
    """Start Tobii recording for participant"""
    global current_session_active, participantName

    if current_session_active:
        return {"error": "Recording already active", "participant": participantName}

    if not tobii_manager.current_participant_label:
        if tobii_manager.initialize(participant_id):
            tobii_manager.current_participant_label = participant_id
        else:
            return {"error": "Failed to initialize Tobii"}

    session_name = f"{participant_id}_screen_{time.strftime('%Y-%m-%d_%H-%M-%S')}"
    if tobii_manager.start_recording(session_name):
        current_session_active = True
        logger.info(f"Started Tobii recording: {session_name}")
        return {
            "message": f"Recording started: {session_name}",
            "participant": participant_id,
        }
    else:
        return {"error": "Failed to start recording"}


@app.get("/tobii/stop")
async def stop_recording():
    """Stop current Tobii recording"""
    global current_session_active

    if not current_session_active:
        return {"error": "No active recording"}

    if tobii_manager.stop_recording():
        current_session_active = False
        logger.info("Stopped Tobii recording")
        return {
            "message": "Recording stopped successfully",
            "participant": participantName,
        }
    else:
        return {"error": "Failed to stop recording"}


# @app.get("/tobii/status")
# async def get_tobii_status():
#     """Get current Tobii recording status"""
#     return {
#         "participant": participantName,
#         "recording_active": current_session_active,
#         "manager_initialized": tobii_manager.current_participant_id is not None,
#     }


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=False)


# @app.middleware("http")
# async def catch_all_exceptions(request: Request, call_next):
#     try:
#         return await call_next(request)
#     except Exception as e:
#         print(f"🔥 Unhandled Exception: {e}")
#         return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
