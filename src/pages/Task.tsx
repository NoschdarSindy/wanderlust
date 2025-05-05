import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Site, taskInfo } from "src/lib/studyData";
import { useWebSocketChannel } from "src/lib/composables";
import { useRecoilState } from "recoil";
import { currentTaskAtom } from "src/lib/atoms";
import { Box, Button, CircularProgress } from "@mui/material";
import { useCustomNavigate } from "src/components/NavigationProvider.tsx";

const tasks = VITE_TASKS?.split(",") as Site[];

const getNextTask = (currentTask?: Site): Site | undefined => {
  const nextIndex = tasks.indexOf(currentTask) + 1;
  if (nextIndex < tasks.length) return tasks[nextIndex];
};

const TaskPage = () => {
  const navigateDelayed = useCustomNavigate();
  const [showTask, setShowTask] = useState(false);
  const [currentTask, setCurrentTask] = useRecoilState(currentTaskAtom);
  const [loading, setLoading] = useState(false);
  const [showTasksButtonDisabled, setShowTasksButtonDisabled] = useState(true);
  const [startButtonDisabled, setStartButtonDisabled] = useState(true);

  const { message } = useWebSocketChannel();

  const loadNextTask = (nextTask) => {
    setShowTask(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentTask(nextTask);
    }, 1500);
  };

  useEffect(() => {
    if (currentTask) {
      setShowTask(true);
    }
  }, [currentTask]);

  useEffect(() => {
    if (showTask) {
      const nextTask = getNextTask(message?.finishedTask);
      if (nextTask) {
        closePreviousTaskTab();
        loadNextTask(nextTask);
      } else navigateDelayed("/questionnaire");
    }
  }, [showTask, message]);

  useEffect(() => {
    if (loading) setTimeout(() => setLoading(false), 2000);
  }, [loading]);

  useEffect(() => {
    console.log("TaskPage message", message);
  }, [message]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome to show confirmation dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const updateState = () => {
      if (!currentTask) {
        timer = setTimeout(() => setShowTasksButtonDisabled(false), 60000);
      } else if (showTask) {
        timer = setTimeout(() => setStartButtonDisabled(false), 2000);
      }
    };

    updateState();

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k") {
        if (!currentTask) setShowTasksButtonDisabled(false);
        else if (showTask) setStartButtonDisabled(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showTask, currentTask]);

  const tabRef = useRef<Window | null>(null);

  const openNewTab = (url: string) => {
    const win = window.open(`https://${url}`, "_blank");
    if (win) {
      tabRef.current = win;
    } else {
      alert("Popup blocked!");
    }
  };

  const closePreviousTaskTab = () => {
    console.log("Closing tab", tabRef.current);
    tabRef.current?.close();
    tabRef.current = null; // clear after closing
  };

  const getTaskInstructions = () => {
    const info = taskInfo[currentTask];

    return (
      <p style={{ userSelect: "none" }}>
        The {tasks.indexOf(currentTask) ? "next task" : "task now"} is to visit{" "}
        <a
          href={"#"}
          onClick={
            startButtonDisabled ? undefined : () => openNewTab(info.domain)
          }
        >
          {info.domain}
        </a>{" "}
        {/*<a*/}
        {/*  href={startButtonDisabled ? undefined : `https://${info.domain}`}*/}
        {/*  target="_blank"*/}
        {/*  onClick={(e) => e.preventDefault()}*/}
        {/*>*/}
        {/*  {info.domain}*/}
        {/*</a>{" "}*/}
        and {info.todo(VITE_CITY)} Lindfurt. {info.additionalText}
        <br />
        When you click Start, the website will automatically open in a new tab.
        <br />
        <br />
        <button
          className="btn btn-primary"
          onClick={() => openNewTab(info.domain)}
          disabled={startButtonDisabled}
        >
          Start
        </button>
      </p>
    );
  };

  return (
    <div className="m-5 p-xl-5">
      {!showTask && (
        <>
          <h3>Setting up the sensors</h3>
          <p>
            The researcher will now assist you with setting up the sensors. Once
            that is done, you can come back to this window and click{" "}
            <i>Continue</i>.
          </p>
          <button
            className="btn btn-primary"
            disabled={showTasksButtonDisabled}
            onClick={() => setShowTask(true)}
          >
            Continue
          </button>
        </>
      )}

      {showTask && currentTask && (
        <div>
          <br />
          <h3>Your Task</h3>
          {getTaskInstructions()}
        </div>
      )}

      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(255, 255, 255, 0.5)"
          zIndex={9999}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default TaskPage;
