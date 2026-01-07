"use client";

import { useState, useEffect } from "react";

// Define the Todo interface based on the backend model
interface Todo {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:8000";

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/todos/`);
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError("Failed to load tasks. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/todos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTodoTitle,
          description: "Created via Web UI", // Default description
          is_completed: false,
        }),
      });

      if (!response.ok) throw new Error("Failed to add todo");
      
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
    } catch (err) {
      console.error(err);
      alert("Error adding task");
    }
  };

  const toggleTodo = async (id: number, currentStatus: boolean) => {
    // Optimistic update
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, is_completed: !currentStatus } : todo
    );
    setTodos(updatedTodos);

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_completed: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
        // Revert on error would go here
      }
    } catch (err) {
      console.error(err);
      // Revert optimistic update
      fetchTodos();
    }
  };

  const deleteTodo = async (id: number) => {
    // Optimistic update
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
    } catch (err) {
      console.error(err);
      fetchTodos(); // Revert
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Todo Phase 2
          </h1>
          <p className="text-lg text-gray-600">
            Full-stack Task Manager with Urdu Support
          </p>
        </header>

        {/* Add Task Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <form onSubmit={addTodo} className="flex gap-4 items-center">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="نئے ٹاسک کا نام لکھیں... (Enter task name)"
              className="flex-1 block w-full rounded-lg border-gray-300 border p-4 text-lg focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition ease-in-out duration-150"
              dir="auto" // Automatically detects RTL for Urdu
            />
            <button
              type="submit"
              disabled={!newTodoTitle.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading tasks...</div>
          ) : todos.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No tasks yet. Add one above!</p>
              <p className="text-gray-400 text-sm mt-1">کوئی کام نہیں ہے</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`group flex items-center justify-between p-5 hover:bg-gray-50 transition duration-150 ease-in-out ${
                    todo.is_completed ? "bg-gray-50/50" : ""
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0 gap-4">
                    <button
                      onClick={() => toggleTodo(todo.id, todo.is_completed)}
                      className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                        todo.is_completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 group-hover:border-indigo-400"
                      }`}
                    >
                      {todo.is_completed && (
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-lg font-medium truncate transition-all duration-200 ${
                          todo.is_completed
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        }`}
                        dir="auto"
                      >
                        {todo.title}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-600 transition duration-150 ease-in-out rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    title="Delete"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}