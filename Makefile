.PHONY: labrecorder

clean:
	lsof -t -i :8000| xargs kill -9

labrecorder:
	cd ~/Projects/wanderlust/LabRecorder/LabRecorder.app/Contents/MacOs; ./LabRecorder

# Open the browser in kiosk mode for preparation of the study
browser:
	/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk --remote-debugging-port=9222 --user-data-dir="~/Library/Application Support/Google/Chrome/Profile 1" staticPages/config.html


