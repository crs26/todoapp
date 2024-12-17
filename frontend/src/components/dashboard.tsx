import { useState } from "react";
import NewTask from "./newTask";
import TaskTable from "./taskTable";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { fetchTasks } from "../features/task/taskSlice";

interface Tab {
  id: string;
  label: string;
  callback: Function;
}

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();

  // Component state for active tab.
  // The default view is the list of pending task.
  const [active, setActive] = useState("todo");

  const tabs: Tab[] = [
    {
      id: "new",
      label: "Add a task",
      callback: () => {
        setActive("new");
      },
    },
    {
      id: "all",
      label: "All",
      callback: () => {
        setActive("all");
        dispatch(fetchTasks({ completed: null, search: null }));
      },
    },
    {
      id: "todo",
      label: "To Do",
      callback: () => {
        setActive("todo");
        dispatch(fetchTasks({ completed: false, search: null }));
      },
    },
    {
      id: "completed",
      label: "Completed",
      callback: () => {
        setActive("completed");
        dispatch(fetchTasks({ completed: true, search: null }));
      },
    },
  ];

  const render = () => {
    if (active == "todo") {
      // Returns a table of uncompleted task.
      return <TaskTable completed={false} active={active} />;
    } else if (active == "all") {
      // Returns a table of all task (Completed and Uncompleted)
      return <TaskTable completed={null} active={active} />;
    } else if (active == "completed") {
      // Returns completed task only.
      return <TaskTable completed={true} active={active} />;
    } else if (active == "new") {
      // Show the new task form.
      // The callback sets the active window after creating task
      return <NewTask callback={() => setActive("todo")} />;
    }
  };
  return (
    <div className="card">
      <div className="flex flex-wrap gap-4 justify-between">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`font-bold py-2 px-4 rounded ${
              active == tab.id
                ? "bg-blue-500 text-white"
                : "bg-blue-800 text-gray-400"
            }`}
            onClick={() => tab.callback()}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {render()}
    </div>
  );
};

export default Dashboard;
