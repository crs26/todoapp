import { useState } from 'react'
import type { RootState } from './store'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTasks } from './features/task/taskSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()

  return (
    <>
      <h1>TaskTastic</h1>
      <div>
        
      </div>
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
            Add a task
          </button>
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => dispatch(fetchTasks())}>
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
      <p className="read-the-docs">
        Developed by csalvadora for MEDDICC
      </p>
    </>
  )
}

export default App
