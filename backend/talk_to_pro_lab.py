import os
import cv2
import time
import threading
import mss
import numpy as np
from psychopy import visual, monitors
from titta import Titta
from titta.TalkToProLab import TalkToProLab
from datetime import datetime
from pathlib import Path
import logging


class TobiiManager:
    def __init__(self):
        # Monitor/geometry
        self.MY_MONITOR = "testMonitor"
        self.SCREEN_RES = [1920, 1200]
        self.SCREEN_WIDTH = 34.472
        self.VIEWING_DIST = 63
        self.FULLSCREEN = True

        # ET settings
        self.et_name = "Tobii Pro Spark"
        self.dummy_mode = False
        self.project_name = None

        # Video recording settings
        self.VIDEO_RES = self.SCREEN_RES
        self.VIDEO_FPS = 15
        self.stop_recording_flag = False
        self.output_dir = None

        # State tracking
        self.tracker = None
        self.ttl = None
        self.win = None
        self.rec = None
        self.video_writer = None
        self.video_thread = None
        self.participant_info = None
        self.current_participant_label = None
        self.recording_start_time = None

        self._setup_monitor()
        self.logger = logging.getLogger(__name__)

    def _setup_monitor(self):
        """Setup monitor configuration"""
        mon = monitors.Monitor(self.MY_MONITOR)
        mon.setWidth(self.SCREEN_WIDTH)
        mon.setDistance(self.VIEWING_DIST)
        mon.setSizePix(self.SCREEN_RES)
        self.monitor = mon

    def initialize(self, participant_label: str):
        """Initialize Tobii connection and calibration"""
        try:
            self.current_participant_label = participant_label
            self.output_dir = Path(
                f"C:/Users/Nosch/Desktop/wanderlust/output/{participant_label}"
            )
            self.output_dir.mkdir(parents=True, exist_ok=True)

            # Setup Titta settings
            settings = Titta.get_defaults(self.et_name)
            settings.FILENAME = participant_label

            # Connect to eye tracker
            self.tracker = Titta.Connect(settings)
            if self.dummy_mode:
                self.tracker.set_dummy_mode()
            self.tracker.init()

            # Talk to Pro Lab
            self.ttl = TalkToProLab(
                project_name=self.project_name, dummy_mode=self.dummy_mode
            )
            self.participant_info = (
                self.ttl.add_participant(participant_label)
                if not self.ttl.find_participant(participant_label)
                else next(
                    p
                    for p in self.ttl.list_participants()["participant_list"]
                    if p["participant_name"] == participant_label
                )
            )

            return True

        except Exception as e:
            self.logger.error(f"Error initializing Tobii: {e}")
            return False

    def _run_calibration(self):
        """Run eye tracker calibration"""
        try:
            self.win = visual.Window(
                monitor=self.monitor,
                fullscr=self.FULLSCREEN,
                screen=0,
                size=self.SCREEN_RES,
                units="deg",
            )

            print("Starting calibration...")
            self.tracker.calibrate(self.win)
            self.win.flip()

            print("Calibration complete. Closing window...")
            self.win.close()
            self.win = None
            time.sleep(2)

        except Exception as e:
            self.logger.error(f"Calibration error: {e}")
            if self.win:
                self.win.close()
                self.win = None

    def start_recording(self, session_name: str) -> bool:
        """Start recording session"""
        try:
            # Check Pro Lab state
            state = self.ttl.get_state()
            if state["state"] != "ready":
                self.logger.error(f"Lab not ready: {state['state']}")
                return False

            print(f"Starting recording session: {session_name}")

            # Start Tobii recording
            self.rec = self.ttl.start_recording(
                session_name,
                self.participant_info["participant_id"],
                screen_width=self.SCREEN_RES[0],
                screen_height=self.SCREEN_RES[1],
            )

            # Start video recording
            self._start_video_recording()

            # Send start event
            timestamp = self.ttl.get_time_stamp()
            self.recording_start_time = int(timestamp["timestamp"])

            if not self.dummy_mode:
                self.ttl.send_custom_event(
                    self.rec["recording_id"],
                    self.recording_start_time,
                    "session_start",
                    session_name,
                )

            return True

        except Exception as e:
            self.logger.exception(f"Error starting recording: {e}")
            return False

    def _start_video_recording(self):
        """Start video recording in separate thread"""
        self.VIDEO_FILENAME = str(
            self.output_dir
            / f"screen_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.mp4"
        )
        print(f"DEBUG: Video will be saved to: {self.VIDEO_FILENAME}")  # Add this line

        self.stop_recording_flag = False

        self.video_thread = threading.Thread(target=self._record_screen_video_mss)
        self.video_thread.daemon = True
        self.video_thread.start()

    def _record_screen_video_mss(self):
        """Record screen video with precise timing for alignment with Tobii gaze data"""
        try:
            with mss.mss() as sct:
                # Get monitor info (main screen)
                monitor = {
                    "top": 0,
                    "left": 0,
                    "width": self.VIDEO_RES[0],
                    "height": self.VIDEO_RES[1],
                }
                target_frame_time = 1.0 / self.VIDEO_FPS

                # Initialize video writer
                fourcc = cv2.VideoWriter_fourcc(*"mp4v")
                self.video_writer = cv2.VideoWriter(
                    self.VIDEO_FILENAME,
                    fourcc,
                    self.VIDEO_FPS,
                    (self.VIDEO_RES[0], self.VIDEO_RES[1]),
                )
                self.logger.info(
                    f"Recording screen: {self.VIDEO_RES[0]}x{self.VIDEO_RES[1]} at {self.VIDEO_FPS} FPS"
                )

                # Track timing
                start_time = time.time()
                frame_count = 0
                next_frame_time = start_time

                while not self.stop_recording_flag:
                    # Wait until the next frame is due
                    if time.time() >= next_frame_time:
                        # Measure capture time
                        screenshot = sct.grab(monitor)

                        # Convert to OpenCV format
                        frame = np.array(screenshot)
                        frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

                        # Write frame
                        self.video_writer.write(frame)
                        frame_count += 1

                        # Schedule next frame
                        next_frame_time += target_frame_time

                    # Sleep briefly to avoid busy-waiting
                    time.sleep(
                        max(0, next_frame_time - time.time())
                    )  # Sleep until next frame

                # Log final stats
                recording_duration = time.time() - start_time
                actual_fps = (
                    frame_count / recording_duration if recording_duration > 0 else 0
                )
                expected_frames = int(recording_duration * self.VIDEO_FPS)
                self.logger.info(
                    f"Recording stopped. Wrote {frame_count} frames in {recording_duration:.2f}s "
                    f"(Actual FPS: {actual_fps:.2f}, Expected frames: {expected_frames})"
                )

                # Check for frame count mismatch
                if abs(frame_count - expected_frames) > 1:
                    self.logger.error(
                        f"Frame count mismatch: Wrote {frame_count}, expected {expected_frames}. "
                        f"Video may not align with Tobii events."
                    )

        except Exception as e:
            self.logger.exception(f"Screen recording error: {e}")
        finally:
            if self.video_writer:
                self.video_writer.release()
                self.video_writer = None

    def stop_recording(self) -> bool:
        """Stop recording session"""
        try:
            # Stop video recording
            self.stop_recording_flag = True
            if self.video_thread:
                self.video_thread.join(timeout=10)

            # Send end event
            timestamp = self.ttl.get_time_stamp()
            t_end = int(timestamp["timestamp"])

            if not self.dummy_mode and self.rec:
                self.ttl.send_custom_event(
                    self.rec["recording_id"], t_end, "session_end", "recording_complete"
                )

            # Upload video to Pro Lab
            self._upload_video_to_prolab(t_end)

            # Stop Tobii recording
            if self.rec:
                self.ttl.stop_recording()
                self.ttl.finalize_recording(self.rec["recording_id"])
                self.rec = None

            print("Recording stopped successfully!")
            return True

        except Exception as e:
            self.logger.error(f"Error stopping recording: {e}")
            return False

    def _upload_video_to_prolab(self, t_end: int):
        """Upload recorded video to Pro Lab"""
        try:
            if os.path.exists(self.VIDEO_FILENAME):
                print("Uploading video to Pro Lab...")
                media_info = self.ttl.upload_media(self.VIDEO_FILENAME, "video")
                print(f"Video uploaded successfully: {media_info}")

                # Map video timeline to recording
                self.ttl.send_stimulus_event(
                    self.rec["recording_id"],
                    self.recording_start_time,
                    media_info["media_id"],
                    end_timestamp=t_end,
                )
                print(
                    f"Stimulus event sent: Video mapped from {self.recording_start_time} to {t_end}"
                )

        except Exception as e:
            self.logger.error(f"Error uploading video: {e}")

    def send_event(self, event_type: str, event_data: str):
        """Send custom event to Tobii"""
        try:
            if self.rec and not self.dummy_mode:
                timestamp = self.ttl.get_time_stamp()
                t_event = int(timestamp["timestamp"])
                self.ttl.send_custom_event(
                    self.rec["recording_id"], t_event, event_type, event_data
                )
                print(f"Tobii event sent: {event_type} - {event_data}")

        except Exception as e:
            self.logger.error(f"Error sending event: {e}")

    def cleanup(self):
        """Cleanup resources"""
        try:
            self.stop_recording_flag = True
            if self.video_writer:
                self.video_writer.release()
            if self.win:
                self.win.close()
            if self.rec:
                self.ttl.stop_recording()
                self.ttl.finalize_recording(self.rec["recording_id"])
            if self.ttl:
                self.ttl.disconnect()
            print("Tobii cleanup completed!")
        except Exception as e:
            self.logger.error(f"Cleanup error: {e}")


# Global instance
tobii_manager = TobiiManager()
