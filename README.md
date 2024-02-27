# Getting started

## Prerequisites
1. Install the Python and JS dependencies
2. Paste this line into your hosts file: `127.0.0.1 wanderlust.travel`
3. Edit the `browser` recipe in the Makefile to match your Chrome executable. If a Chrome session is already running, the browser will not open in Kiosk mode as intended unless a separate profile path is specified in the `--user-data-dir` flag. If no other Chrome session is running you can omit the `--user-data-dir` flag.
4. In Chrome, activate the flag [chrome://flags/#unsafely-treat-insecure-origin-as-secure](chrome://flags/#unsafely-treat-insecure-origin-as-secure) and paste `http://wanderlust.travel` into the textbox below.

## Backend
Run `python backend/server.py` to start the backend server.

## Frontend
1. Run `npm start` to start the react app. Might require higher privileges because it uses port 80. This will not open the browser yet.
2. Run `make browser` to start the browser session in Kiosk mode.