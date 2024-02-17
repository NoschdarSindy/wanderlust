.PHONY: labrecorder

clean:
	lsof -t -i :8000| xargs kill -9

labrecorder:
	cd /Users/nosh/Projects/wanderlust/LabRecorder/LabRecorder.app/Contents/MacOs; ./LabRecorder