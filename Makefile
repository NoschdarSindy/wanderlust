PROFILE_DIR := $(abspath ./_browser-profile)

# Open the browser in kiosk mode for preparation of the study
browser:
	open -a "Google Chrome" --args \
	  --kiosk \
	  --remote-debugging-port=9222 \
	  --no-first-run \
	  --user-data-dir="$(PROFILE_DIR)" \
	  --disable-features=PaymentRequest,AutofillSaveCardPrompt \
	  http://localhost:3000/config


.PHONY: labrecorder

labrecorder:
	cd ~/Projects/wanderlust/LabRecorder/LabRecorder.app/Contents/MacOs; ./LabRecorder