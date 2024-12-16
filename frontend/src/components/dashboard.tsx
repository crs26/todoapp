import { useState } from "react";
import NewTask from "./newTask";
import TaskTable from "./taskTable";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { fetchTasks } from "../features/task/taskSlice";

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  const [active, setActive] = useState("all");

  const render = () => {
    if (active == "todo") {
      return <TaskTable completed={false} />;
    } else if (active == "all") {
      return <TaskTable completed={null} />;
    } else if (active == "completed") {
      return <TaskTable completed={true} />;
    } else if (active == "new") {
      return <NewTask callback={() => setActive("all")} />;
    }
  };
  return (
    <div className="card">
      <div className="flex flex-wrap gap-4">
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => setActive("new")}
        >
          Add a task
        </button>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setActive("all");
            dispatch(fetchTasks({ completed: null }));
          }}
        >
          All
        </button>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setActive("todo");
            dispatch(fetchTasks({ completed: false }));
          }}
        >
          To Do
        </button>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setActive("completed");
            dispatch(fetchTasks({ completed: true }));
          }}
        >
          Completed
        </button>
      </div>
      {render()}
    </div>
  );
};

export default Dashboard;
