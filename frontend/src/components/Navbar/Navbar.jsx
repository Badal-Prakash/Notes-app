import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
function Navbar({ userInfo }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const OnLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleSearch = () => {};
  const onClearSearch = () => {
    setSearchQuery("");
  };
  return (
    <div className="bg-white flex justify-between items-center px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        onClearSearch={onClearSearch}
        handlesearch={handleSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={OnLogout} />
    </div>
  );
}

export default Navbar;
