import {
  LuChevronLeft,
  LuChevronsLeft,
  LuChevronRight,
  LuChevronsRight,
} from "react-icons/lu";
import { Link } from "react-router-dom";

export default function Pagination({ page, pageCount, setPageSize }) {
  // console.log(page, pageCount);

  function getPagination(page, pageNum) {
    const arr = [...Array(pageNum).keys()];
    let out = [];
    if (arr.length <= 3) {
      return Array.from({ length: arr.length }, (_, index) => index + 1);
    }
    if (page <= 2) {
      out.push(1, 2, "...", arr.length);
      return out;
    }
    if (arr.length - page < 3) {
      out.push(arr.length - 2, arr.length - 1, arr.length);
      return out;
    }
    for (let i = 1; i < arr.length; i++) {
      if (page - i > 2 || i > page) continue;
      out.push(i);
    }
    // if (arr.length - page <= 2) out.push(arr.length-1,arr.length)
    if (arr.length - page > 2) out.push("...", arr.length);
    return out;
  }

  const handleSetPageSize = (e) => {
    setPageSize(e.target.value);
  };

  return (
    <div className="pagination flex flex-wrap justify-end sm:justify-between gap-y-2 gap-x-4 items-center mt-5">
      <div className="flex justify-end space-x-1">
        <Link to={`/search?page=${1}`}>
          <button disabled={page === 1}>
            <LuChevronsLeft />
          </button>
        </Link>
        <Link to={`/search?page=${page - 1}`}>
          <button disabled={page === 1}>
            <LuChevronLeft />
          </button>
        </Link>
        {getPagination(page, pageCount).map((num) => (
          <Link
            key={num}
            to={`/search?page=${
              typeof num === "number"
                ? num
                : page + Math.floor((pageCount - page) / 2)
            }`}
          >
            <button
              className={`border rounded-md px-2 transition duration-200 ${
                page === num ? "bg-blue-500 !border-blue-500 !text-white" : ""
              }`}
            >
              {num}
            </button>
          </Link>
        ))}
        <Link to={`/search?page=${page + 1}`}>
          <button disabled={page === pageCount}>
            <LuChevronRight />
          </button>
        </Link>
        <Link to={`/search?page=${pageCount}`}>
          <button disabled={page === pageCount}>
            <LuChevronsRight />
          </button>
        </Link>
      </div>
      <span className="order-[-1]">
        <label htmlFor="page-size-select" className="mr-3 font-medium">
          Pages
        </label>
        <select
          name="page-size-select"
          className="border rounded-md px-2"
          onChange={handleSetPageSize}
        >
          {[3, 5, 7].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </span>
    </div>
  );
}
