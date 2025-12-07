import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import TodoIcon from "./assets/Todo.svg";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(false);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    console.log("Retrieved from localStorage:", todoString);

    if (todoString) {
      try {
        let todos = JSON.parse(todoString);
        setTodos(todos);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    let t = todos.filter((i) => i.id === id);
    setTodo(t[0].todo);
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos);
  };

  const handleDelete = (e, id) => {
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos);
  };

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    setTodo("");
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex((item) => {
      return item.id === id;
    });
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
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

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd();
              }}
              className="w-full flex flex-col sm:flex-row gap-3 items-center"
            >
              <input
                onChange={handleChange}
                value={todo}
                type="text"
                className="flex-1 rounded-full px-5 py-2 border border-gray-300 shadow-sm 
               focus:ring-2 focus:ring-violet-500 outline-none w-full"
              />

              <button
                type="submit"
                disabled={todo.length <= 0}
                className="bg-violet-800 hover:bg-violet-950 px-6 py-2 text-sm 
               disabled:bg-violet-700 font-bold text-white rounded-full 
               cursor-pointer transition-all mt-2 sm:mt-0"
              >
                Save
              </button>
            </form>
          </div>
        </div>

        <div className="flex items-center gap-2 my-4 flex-wrap">
          <input
            id="show"
            onChange={toggleFinished}
            type="checkbox"
            checked={showFinished}
            className="cursor-pointer size-5"
          />
          <label className="mx-2 text-lg" htmlFor="show">
            Show only completed tasks
          </label>
        </div>

        <div className="h-[2px] bg-gray-700 w-[90%] my-3 mx-auto opacity-20"></div>

        <h2 className="text-2xl font-bold mb-3">Your Todos :</h2>

        <div className="todos space-y-4">
          {todos.length === 0 && (
            <div className="m-5 text-gray-600 text-center text-lg sm:flex-auto">
              No Todos to display
            </div>
          )}

          {todos.filter((item) => item.isCompleted === showFinished).length ===
            0 &&
            todos.length > 0 && (
              <div className="m-5 text-gray-600 text-center text-lg">
                {showFinished ? "No completed tasks!" : "No todos to finish!"}
              </div>
            )}

          {todos
            .filter((item) => item.isCompleted === showFinished)
            .map((item) => {
              return (
                <div
                  key={item.id}
                  className="todo relative bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:text-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 sm:pb-0">
                    <span
                      className="
      scale-125
      cursor-pointer
      select-none
      font-medium
      hover:text-violet-700
      transition
      text-violet-600
      accent-violet-600
      rounded
      text-sm
      sm:text-base
      md:text-base
      text-center
      sm:text-left
      md:text-left
      w-full
      sm:w-auto
      p-4

    "
                    >
                      Mark as Done
                    </span>

                    <input
                      name={item.id}
                      onChange={handleCheckbox}
                      type="checkbox"
                      checked={item.isCompleted}
                      className="scale-125 mt-1 cursor-pointer accent-violet-600 rounded transition"
                    />

                    <div
                      className={
                        item.isCompleted
                          ? "line-through text-gray-500 mt-2 sm:mt-0"
                          : "text-gray-800 mt-2 sm:mt-0"
                      }
                    >
                      {item.todo}
                    </div>
                  </div>
                  <div className="buttons flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                    <button
                      onClick={(e) => handleEdit(e, item.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-bold text-white rounded-md flex items-center gap-2 transition w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-bold text-white rounded-md flex items-center gap-2 transition w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <AiFillDelete /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default App;
