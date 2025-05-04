import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const navgate = useNavigate();
  const handelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navgate(`/?search=${encodeURIComponent(query)}`);
  };
  return (
    <>
      <form className="search-bar" onSubmit={handelSubmit}>
        <input
          className="search-input"
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </>
  );
}
export default Search;
