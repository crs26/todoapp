import React from "react";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchTasks, updateTask, deleteTask } from "../features/task/taskSlice";
import { FaCheck, FaTrash } from "react-icons/fa";

const TaskTable = () => {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { tasks, loading } = useAppSelector((state) => state.task);

  const handleMarkAsCompleted = (id: number) => {
    dispatch(updateTask(id));
  };

  const handleDeleteTask = (id: number) => {
    dispatch(deleteTask(id));
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <table className="min-w-full border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Title</th>
              <th className="px-4 py-2 border-b text-left">Description</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 font-semibold text-white">
                  {task.title}
                </td>
                <td className="px-4 py-2 text-sm text-gray-300">
                  {task.description}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-green-500 hover:text-green-700 mx-2"
                    onClick={() => handleMarkAsCompleted(task.id)}
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 mx-2"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskTable;
