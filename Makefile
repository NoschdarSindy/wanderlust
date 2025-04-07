PROFILE_DIR := $(abspath ./_browser-profile)

.PHONY: labrecorder

clean:
	lsof -t -i :8000| xargs kill -9

labrecorder:
	cd ~/Projects/wanderlust/LabRecorder/LabRecorder.app/Contents/MacOs; ./LabRecorder

# Open the browser in kiosk mode for preparation of the study
browser:
	open -a "Google Chrome" --args \
	  --kiosk \
	  --remote-debugging-port=9222 \
	  --no-first-run \
	  --user-data-dir="$(PROFILE_DIR)" \
	  http://localhost:3000/config
