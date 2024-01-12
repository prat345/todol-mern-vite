import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios, { all } from "axios";

axios.defaults.baseURL = "http://localhost:5000/";

function App() {
  const [allTodo, setAllTodo] = useState([{ _id: "w123", task: "default" }]);
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [pageNum, setPageNum] = useState(3);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [countTasks, setCountTasks] = useState();

  const fetchTodo = async () => {
    const { data } = await axios.get(`/todo?page=${page}&pageSize=${pageSize}`);
    console.log("GET", data.todos);
    setAllTodo(data.todos);
    setCountTasks(data.countTasks);
    setPageNum(Math.ceil(data.countTasks / pageSize));
  };

  useEffect(() => {
    fetchTodo();
    console.log(allTodo.length, page, pageSize, pageNum);
  }, [page, pageSize, pageNum]);

  // Delete each task
  const deleteTodo = async (_id) => {
    const { data } = await axios.delete(`/todo/delete/${_id}`, { _id: _id });
    console.log("deleted", data.task);
    fetchTodo();
  };

  const handleChange = (e) => {
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
    // const newTodo = allTodo.filter(
    //   (task, i) => !selectedTasks.includes(task._id)
    // );
    // console.log(newTodo);
    // setAllTodo(newTodo);
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

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="flex justify-center items-center flex-col space-y-10 p-10 bg-stone-100 shadow-lg rounded-lg "
        style={{ width: "80vw" }}
      >
        <h1 className="text-2xl font-bold capitalize">todo list MERN</h1>
        <form>
          <input
            type="text"
            name="task"
            value={inputValue}
            onChange={handleChange}
            className="mr-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 px-2 py-1 transition duration-300 ease-in-out"
          />
          <button
            onClick={handleSubmit}
            className="text-white bg-slate-500 px-2 py-1 rounded-md mr-2 hover:bg-slate-700 transition duration-300"
            disabled={!isValid}
          >
            Add Todo
          </button>
          {!isValid && (
            <p className="text-red-500">Must be between 3-30 characters</p>
          )}
        </form>
        <button
          onClick={handleDeleteSelected}
          className="self-end text-white bg-orange-500 px-2 py-1 rounded-md mr-2 hover:bg-orange-700 transition duration-300"
        >
          Delete Many
        </button>
        <div className="table-container bg-white rounded-md w-full p-4 !mt-4">
          <p>
            {selectedTasks.length}/{countTasks} results
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
                <th className="px-4 py-2">Index</th>
                <th className="px-4 py-2">Task ID</th>
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
                  <td className="px-4 py-2">{index}</td>
                  <td className="px-4 py-2">
                    {task._id ? task._id.slice(-5) : ""}
                  </td>
                  <td className="px-4 py-2">{task.task}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => updateTodo(task._id)}
                      className="text-white bg-blue-500 px-2 py-1 rounded-md mr-2 hover:bg-blue-700 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(task._id)}
                      className="text-white bg-red-500 px-2 py-1 rounded-md hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between">
            <div className="flex justify-end space-x-2">
              {[...Array(pageNum).keys()].map((i) => (
                <button
                  className={`border rounded-md px-2 transition duration-200 ${
                    page === i + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <span>
              <label htmlFor="page-size-select" className="mr-3 font-medium">
                Pages
              </label>
              <select
                name="page-size-select"
                className="border rounded-md px-2 py-1"
                onChange={(e) => setPageSize(e.target.value)}
              >
                {[3, 5, 7].map((n) => (
                  <option value={n}>{n}</option>
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
