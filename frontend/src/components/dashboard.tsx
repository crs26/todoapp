const Dashboard = () => {
  return (
    <div className="card">
      <div className="flex flex-wrap gap-4">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          Add a task
        </button>
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          All
        </button>
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          To Do
        </button>
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          Completed
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
