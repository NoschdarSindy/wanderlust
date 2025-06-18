# Getting started

## Prerequisites
For full functionality, a Windows computer is needed with Chrome installed.

1. Install the JS and Python dependencies inside the package.json and requirements.txt
2. Paste these lines into your hosts file:
```
127.0.0.1 wanderlust.travel
127.0.0.1 flyskyway.com
```

## Backend
Run `python backend/server.py` to start the backend server.

## Frontend
Run `npm start` to start the react apps. The backend needs to be running because the frontend requests the next participant number to handle the counterbalancing.

# Results are stored by participant in a folder called `output`.
