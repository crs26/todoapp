import { useState } from "react";
import NewTask from "./newTask";

const Dashboard = () => {
  const [active, setActive] = useState("todo");

  const render = () => {
    if (active == "todo") {
      return <div>To Do</div>;
    } else if (active == "all") {
      return <div>All Task</div>;
    } else if (active == "completed") {
      return <div>Completed Task</div>;
    } else if (active == "new") {
      return <NewTask />;
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
          onClick={() => setActive("all")}
        >
          All
        </button>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => setActive("todo")}
        >
          To Do
        </button>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => setActive("completed")}
        >
          Completed
        </button>
      </div>
      {render()}
    </div>
  );
};

export default Dashboard;
