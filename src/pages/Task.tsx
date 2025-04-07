import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Site, taskInfo } from "src/lib/studyData";
import { useWebSocketChannel } from "src/lib/composables";
import { useRecoilState } from "recoil";
import { currentTaskAtom } from "src/lib/atoms";
import { Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const tasks = process.env.REACT_APP_TASKS?.split(",") as Site[];

const getNextTask = (currentTask?: Site): Site | undefined => {
  const nextIndex = tasks.indexOf(currentTask) + 1;
  if (nextIndex < tasks.length) return tasks[nextIndex];
};

const TaskPage = () => {
  const navigate = useNavigate();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showTask, setShowTask] = useState(false);
  const [task, setTask] = useRecoilState(currentTaskAtom);
  const [loading, setLoading] = useState(false);

  const { message } = useWebSocketChannel();

  useEffect(() => {
    if (task) {
      setLoading(true);
      setShowTask(true);
    }
  }, [task]);

  useEffect(() => {
    if (showTask) {
      const nextTask = getNextTask(message.finishedTask);
      if (nextTask) setTask(nextTask);
      else navigate("/questionnaire");
    }
  }, [showTask, message]);

  useEffect(() => {
    if (loading) setTimeout(() => setLoading(false), 2000);
  }, [loading]);

  useEffect(() => {
    if (!task) setTimeout(() => setButtonDisabled(false), 0); // TODO set higher again
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome to show confirmation dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const getTaskInstructions = () => {
    const info = taskInfo[task];

    return (
      <p>
        The {tasks.indexOf(task) ? "task now" : "next task"} is to visit{" "}
        <a href={`https://${info.domain}`} target="_blank">
          {info.domain}
        </a>{" "}
        and {info.todo} Lindfurt. {info.additionalText}
        <br />
        <a
          href={`https://${info.domain}`}
          target="_blank"
          className="btn btn-primary"
        >
          Start
        </a>
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
            disabled={buttonDisabled}
            onClick={() => setShowTask(true)}
          >
            Continue
          </button>
        </>
      )}

      {showTask && task && (
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
