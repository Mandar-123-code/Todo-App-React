import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import TodoIcon from "./assets/Todo.svg";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);

  // Vite environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/todos`);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
      alert("Unable to fetch todos. Please check your backend or network.");
      setTodos([]);
    }
  };

  const handleAdd = async () => {
    if (!title) return;
    try {
      await axios.post(`${API_URL}/todos`, {
        title,
        description,
        isCompleted: false,
      });
      setTitle("");
      setDescription("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
      alert("Unable to add todo. Please try again.");
    }
  };

  const handleEdit = (e, todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setTodos(todos.filter((t) => t._id !== todo._id));
  };

  const handleDelete = async (todo) => {
    try {
      await axios.delete(`${API_URL}/todos/${todo._id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
      alert("Unable to delete todo. Please try again.");
    }
  };

  const handleCheckbox = async (todo) => {
    try {
      await axios.put(`${API_URL}/todos/${todo._id}`, {
        isCompleted: !todo.isCompleted,
      });
      setTodos((prev) =>
        prev.map((t) =>
          t._id === todo._id ? { ...t, isCompleted: !t.isCompleted } : t,
        ),
      );
    } catch (err) {
      console.error("Error updating todo:", err);
      alert("Unable to update todo status. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2 shadow-2xl border border-violet-200">
        <div className="flex justify-center mt-2">
          <img
            src={TodoIcon}
            alt="Todo Icon"
            className="w-16 h-16 drop-shadow-lg"
          />
        </div>

        <h1 className="font-bold text-center text-3xl mb-4 tracking-wide">
          iTask - Manage your todos at one place
        </h1>

        <div className="addTodo my-5 flex flex-col gap-4 bg-white p-5 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="w-full flex flex-col sm:flex-row gap-3 items-center"
          >
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded-full px-5 py-2 border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-500 outline-none w-full"
            />
            <input
              type="text"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 rounded-full px-5 py-2 border border-gray-300 shadow-sm focus:ring-2 focus:ring-violet-500 outline-none w-full"
            />
            <button
              type="submit"
              disabled={title.length <= 0}
              className="bg-violet-800 hover:bg-violet-950 px-6 py-2 text-sm disabled:bg-violet-700 font-bold text-white rounded-full cursor-pointer transition-all mt-2 sm:mt-0"
            >
              Save
            </button>
          </form>
        </div>

        <h2 className="text-2xl font-bold mb-3">Your Todos :</h2>

        <div className="todos space-y-4">
          {todos.length === 0 && (
            <div className="m-5 text-gray-600 text-center text-lg sm:flex-auto">
              No Todos to display
            </div>
          )}

          {todos.map((item) => (
            <div
              key={item._id}
              className="todo relative bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:text-sm"
            >
              <div className="flex flex-row items-center gap-3 w-full">
                <input
                  name={item._id}
                  onChange={() => handleCheckbox(item)}
                  type="checkbox"
                  checked={item.isCompleted}
                  className="scale-125 cursor-pointer accent-violet-600 rounded transition flex-shrink-0"
                />
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full justify-between">
                  <div
                    className={
                      item.isCompleted
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }
                  >
                    <strong>{item.title}</strong>
                    <div className="text-gray-600 text-sm">
                      {item.description}
                    </div>
                  </div>
                  <span
                    className={
                      item.isCompleted
                        ? "bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                        : "bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                    }
                  >
                    {item.isCompleted ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="buttons flex flex-wrap sm:flex-row gap-4 mt-4 sm:mt-0 sm:ml-4 justify-center sm:justify-start">
                <button
                  onClick={(e) => handleEdit(e, item)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-bold text-white rounded-md flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <FaEdit /> Edit
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-bold text-white rounded-md flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <AiFillDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
