default:
	kill -9 $(lsof -i tcp:8000); python3 -m uvicorn backend.api:app --reload