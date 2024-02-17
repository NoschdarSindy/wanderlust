import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random
import time

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

events = ['cookies', 'geolocation', 'notifications', 'confirmshaming', 'creditcard', 'id']


info = StreamInfo("Frontend Events","Markers",1,0, 'string', 'frontend')
outlet = StreamOutlet(info)
print('Ready to send date.')

@app.get("/")
async def hello():

    # first create a new stream info (here we set the name to BioSemi,
    # the content-type to EEG, 8 channels, 100 Hz, and float-valued data) The
    # last value would be the serial number of the device or some other more or
    # less locally unique identifier for the stream as far as available (you
    # could also omit it but interrupted connections wouldn't auto-recover).
    # info = StreamInfo('BioSemi', 'EEG', 8, 100, 'float32', 'frontend')



# next make an outlet

    print("now sending data...")
    while True:
    # make a new random 8-channel sample; this is converted into a
    # pylsl.vectorf (the data type that is expected by push_sample)
        mysample = [random.random(), random.random(), random.random(),
                    random.random(), random.random(), random.random(),
                    random.random(), random.random()]
        # now send it and wait for a bit
        outlet.push_sample(mysample)
        time.sleep(0.01)

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
