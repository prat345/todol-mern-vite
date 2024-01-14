import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  LuChevronLeft,
  LuChevronsLeft,
  LuChevronRight,
  LuChevronsRight,
  LuTrash2,
  LuPenLine,
} from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import Pagination from "./components/Pagination";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_API; // vite

function App() {
  const [allTodo, setAllTodo] = useState([{ _id: "0000", task: "default" }]);
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [pageCount, setpageCount] = useState(1);
  // const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [countTasks, setCountTasks] = useState();

  const { search } = useLocation();
  console.log(search);
  const sp = new URLSearchParams(search);
  const page = parseInt(sp.get("page") || 1);
  console.log(page);

  const fetchTodo = async () => {
    const { data } = await axios.get(`/todo?page=${page}&pageSize=${pageSize}`);
    console.log("GET", data.todos);
    setAllTodo(data.todos);
    setCountTasks(data.countTasks);
    setpageCount(Math.ceil(data.countTasks / pageSize));
  };

  useEffect(() => {
    fetchTodo();
    console.log(
      `Tasks:${countTasks} page:${page} perpage:${pageSize} npages:${pageCount}`
    );
  }, [pageSize, pageCount, page]);

  // Delete each task
  const deleteTodo = async (_id) => {
    const { data } = await axios.delete(`/todo/delete/${_id}`, { _id: _id });
    console.log("deleted", data.task);
    fetchTodo();
  };

  const handleChange = (e) => {
    setIsTouched(true);
    setInputValue(e.target.value);
    if (e.target.value.length < 3 || e.target.value.length > 30) {
      setIsValid(false);
      console.log("Invalid: ", e.target.value);
      return;
    }
    console.log("Valid: ", e.target.value);
    setIsValid(true);
  };

  // Add
  const handleSubmit = async (e) => {
    console.log(inputValue);
    e.preventDefault();
    await axios.post("/todo/add", {
      task: inputValue,
    });
    setInputValue("");
    setIsValid(false);
    setIsTouched(false);
    fetchTodo();
  };

  // Edit
  const updateTodo = async (_id) => {
    const newTask = prompt(`update ${_id} ?`);
    console.log(newTask);
    const { data } = await axios.put(`/todo/update/${_id}`, {
      _id: _id,
      newTask,
    });
    console.log(`update to ${data.task}`);
    fetchTodo();
  };

  // Select Multiple
  const handleSelectTask = (_id) => {
    if (selectedTasks.includes(_id)) {
      const newSelectedTasks = selectedTasks.filter((i) => i !== _id);
      setSelectedTasks(newSelectedTasks);
    } else {
      const newSelectedTasks = [...selectedTasks, _id];
      setSelectedTasks(newSelectedTasks);
    }
  };

  // Delete Multiple
  const handleDeleteSelected = async () => {
    console.log("To delete", selectedTasks);
    const { data } = await axios.post("/todo/delete_selected", {
      selectedTasks,
    });
    console.log(data);
    fetchTodo();
    setIsSelectAll(false);
    setSelectedTasks([]);
  };

  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    console.log(isSelectAll);
    // setSelectedTasks(allTodo.map((task, i) => task._id));
    if (isSelectAll) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(allTodo.map((task, i) => task._id));
    }
  };

  // pagination
  // const getPagination = (page, pageCount) => {
  //   const arr = [...Array(pageCount).keys()];
  //   let out = [];
  //   // less than 3 pages show 1,2,3
  //   if (arr.length <= 3) {
  //     return Array.from({ length: arr.length }, (_, index) => index + 1);
  //   }
  //   // at last 3 pages show last 3
  //   if (arr.length - page < 3) {
  //     return [arr.length - 2, arr.length - 1, arr.length];
  //   } else {
  //     if (page <= 3) {
  //       out.push(1, 2, 3, "...", arr.length);
  //       return out;
  //     }
  //     for (let i = 1; i < arr.length; i++) {
  //       // show 2 pages before current and ... after
  //       if (page - i > 2 || i > page) continue;
  //       out.push(i);
  //     }
  //     if (arr.length - page > 2) out.push("...", arr.length);
  //   }
  //   // console.log(page, out);
  //   return out;
  // };

  return (
    <div className="px-2">
      <div
        className="flex justify-center items-center flex-col space-y-10 px-2 py-4 sm:p-10 bg-stone-100 shadow-lg rounded-lg"
        style={{ minWidth: "80vw" }}
      >
        <h1 className="text-xl sm:text-3xl font-bold uppercase text-center">
          todo list MERN
        </h1>
        <div className="flex justify-center items-center space-y-2">
          <input
            type="text"
            name="task"
            value={inputValue}
            onChange={handleChange}
            className="mr-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 px-2 py-1 transition duration-300 ease-in-out"
          />
          <button
            onClick={handleSubmit}
            className="text-white bg-blue-500 border-2 border-blue-500 px-2 py-1 rounded-md !m-0 hover:bg-blue-700 hover:border-blue-700 transition duration-300"
            disabled={!isValid}
          >
            Add new
          </button>
          {isTouched && !isValid && (
            <p className="text-sm" style={{ color: "red" }}>
              Must contain 3-30 characters
            </p>
          )}
        </div>
        <button
          onClick={handleDeleteSelected}
          className="self-end text-white bg-red-500 border-2 border-red-500 px-2 py-1 rounded-md mr-2 hover:bg-red-700 hover:border-red-700 transition duration-300"
        >
          Delete selected
        </button>
        <div className="table-container bg-white rounded-md w-full p-4 !mt-4">
          <p>
            {selectedTasks.length}/{countTasks}{" "}
            <span className="font-medium">selected </span>
          </p>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-slate-700">
              <tr>
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={isSelectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-2 hidden sm:table-cell">Index</th>
                <th className="px-4 py-2 hidden md:table-cell">Task ID</th>
                <th className="px-4 py-2">Task</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTodo.map((task, index) => (
                <tr key={task._id} className="text-center">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      name="task-key"
                      value={task?._id}
                      checked={selectedTasks.includes(task._id)}
                      onChange={(e) => handleSelectTask(e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell">
                    {pageSize * (page - 1) + index + 1}
                  </td>
                  <td className="px-4 py-2 hidden md:table-cell">
                    {task._id ? task._id.slice(-4) : ""}
                  </td>
                  <td className="px-4 py-2">{task.task}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => updateTodo(task._id)}
                        className="text-xl text-slate-500 p-2 hover:text-slate-900"
                      >
                        <LuPenLine />
                      </button>
                      <button
                        onClick={() => deleteTodo(task._id)}
                        className="text-xl text-red-500 p-2 hover:text-red-900"
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination flex flex-wrap justify-end sm:justify-between gap-y-2 gap-x-4 items-center mt-5">
            <Pagination page={page} pageCount={pageCount} />
            <span className="order-[-1]">
              <label htmlFor="page-size-select" className="mr-3 font-medium">
                Pages
              </label>
              <select
                name="page-size-select"
                className="border rounded-md px-2"
                onChange={(e) => setPageSize(e.target.value)}
              >
                {[3, 5, 7].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
