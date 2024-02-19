import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pylsl import StreamInfo, StreamOutlet, pylsl

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

events = ['cookies', 'geolocation', 'confirmshaming', 'personalDetails', 'confusingCheckbox', 'creditCard', 'id', 'cameraPermission']


info = StreamInfo("Frontend Events","Markers",1,0, 'string', 'frontend')
outlet = StreamOutlet(info)
print('Ready to send data.')


@app.get("/")
async def hello():
    return {"message": "Hello"}


@app.get("/{event}/{start_or_end}")
async def get_event(event: str, start_or_end: str):
    if event not in events:
        raise HTTPException(status_code=404, detail="Event not found")
    if start_or_end not in ['start', 'end']:
        raise HTTPException(status_code=404, detail="Specify start or end for " + event)

    marker_name = event + '-' + start_or_end

    outlet.push_sample([marker_name], pylsl.local_clock())
    print('Pushed ' + marker_name)

    return {"message": "Pushed " + marker_name + " to stream."}
