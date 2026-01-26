## Screenshots

| Flight booking | Hotel Booking |
|----------------|---------------|
| <img width="1920" height="1200" alt="2" src="https://github.com/user-attachments/assets/8250d40c-870b-493a-a1e1-5eee0aa0c7a2" /> | <img width="1920" height="1200" alt="1" src="https://github.com/user-attachments/assets/054d1623-a6a8-444c-b6be-2edcc12e30e9" /> |
| <img width="1920" height="1200" alt="4" src="https://github.com/user-attachments/assets/5484d20d-9980-463b-aa7e-40ea94ca5404" /> | <img width="1920" height="1200" alt="4" src="https://github.com/user-attachments/assets/eab425e3-4a0a-49ee-aec5-c1263b99fc14" /> |
| <img width="1920" height="1200" alt="item" src="https://github.com/user-attachments/assets/04b749a6-bade-4a94-b2aa-24aa36749a12" /> | <img width="1920" height="1200" alt="item" src="https://github.com/user-attachments/assets/3d4cbf31-0089-4c81-b57f-6a9db8c915e3" /> |
| <img width="1920" height="1200" alt="summary" src="https://github.com/user-attachments/assets/5a553601-cc5b-4a60-8d7b-9f8b791d5a7d" /> | <img width="1920" height="1200" alt="summary" src="https://github.com/user-attachments/assets/13bd41a8-e8f5-45c9-976b-64dc88313352" /> |
| <img width="1920" height="1200" alt="success" src="https://github.com/user-attachments/assets/dbc1dd10-9f79-4117-a5d7-b8cbe48a3d3a" /> | <img width="1920" height="1200" alt="success" src="https://github.com/user-attachments/assets/b66a5240-98a3-4728-92ff-be40b6ec5696" /> |

# Getting started

## Prerequisites
For full functionality, a Windows computer is needed with Chrome installed.

1. Install the JS and Python dependencies inside the package.json and requirements.txt
2. Paste these lines into your hosts file:
```
127.0.0.1 wanderlust.travel
127.0.0.1 flyskyway.com
```
3. Add the certificate in the `certs` folder to the Windows trust store

## Backend
Run `python backend/server.py` to start the backend server.

## Frontend
Run `npm start` to start the react apps. The backend needs to be running because the frontend requests the next participant number to handle the counterbalancing.

# Results
Results are stored by participant in a folder called `output`.
