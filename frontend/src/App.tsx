import React, { useEffect, useState } from 'react';
import { TaskItem } from './types';
import { getTasks, addTask, updateTask, deleteTask } from './api';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [desc, setDesc] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      localStorage.setItem('tasks', JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;
    const newTask = await addTask(desc.trim());
    const next = [...tasks, newTask];
    setTasks(next);
    setDesc('');
    localStorage.setItem('tasks', JSON.stringify(next));
  };

  const onToggle = async (t: TaskItem) => {
    const updated = { ...t, isCompleted: !t.isCompleted };
    await updateTask(updated);
    const next = tasks.map(x => (x.id === t.id ? updated : x));
    setTasks(next);
    localStorage.setItem('tasks', JSON.stringify(next));
  };

  const onDelete = async (id: string) => {
    await deleteTask(id);
    const next = tasks.filter(t => t.id !== id);
    setTasks(next);
    localStorage.setItem('tasks', JSON.stringify(next));
  };

  const filtered = tasks.filter(t =>
    filter === 'all' ? true : filter === 'active' ? !t.isCompleted : t.isCompleted
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 sm:p-6 flex flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-5 sm:p-8 transition-all duration-300">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-6 tracking-tight">
          Task Manager
        </h1>

        {/* Add Task */}
        <form
          onSubmit={onAdd}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="What do you need to do?"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Add
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                filter === f
                  ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 border-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="divide-y divide-gray-200">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-6 italic">
              No tasks to show
            </p>
          ) : (
            filtered.map(t => (
              <li
                key={t.id}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-2 rounded-lg transition-all duration-200 ${
                  t.isCompleted
                    ? 'bg-green-50 border border-green-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.isCompleted}
                    onChange={() => onToggle(t)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer transition-all duration-150"
                  />
                  <div className="flex flex-col">
                    <span
                      className={`text-gray-800 transition-all duration-200 ${
                        t.isCompleted
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                      }`}
                    >
                      {t.description}
                    </span>
                    {t.isCompleted && (
                      <span className="text-xs text-green-600 font-medium mt-0.5">
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-2 sm:mt-0 sm:ml-4">
                  {t.isCompleted && (
                    <button
                      onClick={() => onToggle(t)}
                      className="text-sm text-blue-500 hover:text-blue-700 transition"
                    >
                      Restore
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(t.id)}
                    className="text-sm text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
