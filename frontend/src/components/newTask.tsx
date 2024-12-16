import React, { useState } from "react";
import type { RootState, AppDispatch } from "../store";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { addNewTask, fetchTasks } from "../features/task/taskSlice";

interface Props {
  callback: Function;
}
const NewTask = (props: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { loading } = useAppSelector((state) => state.task);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addNewTask({ title, description }));
    dispatch(fetchTasks());
    props.callback();

    // Reset title and description values.
    setTitle("");
    setDescription("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-white mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-white mb-1"
          >
            Description
          </label>

          <textarea
            id="description"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white rounded-lg ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Create new task"}
        </button>
      </form>
    </div>
  );
};

export default NewTask;
