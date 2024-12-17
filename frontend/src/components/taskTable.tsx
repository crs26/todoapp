import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  updateTask,
  deleteTask,
  Task,
  setTask,
  fetchTasks,
} from "../features/task/taskSlice";
import { FaCheck, FaTrash } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import React, { useEffect, useState } from "react";

interface Props {
  completed: boolean | null;
  active: string;
}

const TaskTable = (props: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { tasks, loading } = useAppSelector((state) => state.task);
  const [searchKey, setSearchKey] = useState("");

  // Reload the tasks by fetching from the api.
  useEffect(() => {
    if (props.completed != null) {
      // Fetch the task depending on the comppleted props value.
      dispatch(fetchTasks({ completed: props.completed, search: searchKey }));
    } else {
      // Fetch all task.
      dispatch(fetchTasks({ completed: null, search: searchKey }));
    }
  }, []);

  // Reset the search input when changing tabs.
  useEffect(() => {
    setSearchKey("");
  }, [tasks]);

  const handleMarkAsCompleted = (task: Task) => {
    // Push the changes to backend only.
    dispatch(updateTask({ ...task, is_completed: !task.is_completed }));
    // Update the redux state.
    dispatch(setTask({ ...task, is_completed: !task.is_completed }));
  };

  const handleDeleteTask = (id: number) => {
    dispatch(deleteTask(id));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchTasks({ completed: props.completed, search: searchKey }));
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div>
          <div className="inline-flex align-middle mb-2">
            {props.active == "all" || props.active == "todo" ? (
              <div className="mx-4">
                <p className="text-lg">
                  {tasks.filter((task) => !task.is_completed).length}
                </p>
                <p className="text-xs">Pending</p>
              </div>
            ) : (
              ""
            )}
            {props.active == "all" || props.active == "completed" ? (
              <div className="mx-4">
                <p className="text-lg">
                  {tasks.filter((task) => task.is_completed).length}
                </p>
                <p className="text-xs">Completed</p>
              </div>
            ) : (
              ""
            )}
            <form className="flex items-center" onSubmit={handleSearch}>
              <div className="inline-flex" role="group">
                <input
                  type="text"
                  id="username"
                  className=" p-1 border-gray-300 rounded-s-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className=" p-1 bg-blue-500 text-gray-200 rounded-e-lg"
                >
                  Search Task
                </button>
              </div>
            </form>
          </div>
          <table className="min-w-full border border-gray-400">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-center">Title</th>
                <th className="px-4 py-2 border-b text-center">Description</th>
                <th className="px-4 py-2 border-b text-center">Date</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-700">
                  <td className="px-4 py-2 font-semibold text-white">
                    {task.title}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    {task.description}
                  </td>
                  <td>
                    <div>
                      <div>
                        <p className="text-xs text-gray-400 font-thin">
                          Created: {task?.date_created?.toString()}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 font-thin">
                        Completed:{" "}
                        {task?.date_completed?.toString() || "Not yet"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {task.is_completed ? (
                      <button
                        className="text-red-500 hover:text-red-700 mx-2"
                        onClick={() => handleMarkAsCompleted(task)}
                        disabled={loading}
                      >
                        <FcCancel />
                      </button>
                    ) : (
                      <button
                        className="text-green-500 hover:text-green-700 mx-2"
                        onClick={() => handleMarkAsCompleted(task)}
                        disabled={loading}
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      className="text-red-500 hover:text-red-700 mx-2"
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={loading}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
