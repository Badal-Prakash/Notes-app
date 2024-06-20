import React from "react";
import { getInitial } from "../../utils/helper";

function ProfileInfo({ onLogout }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full font-medium text-slate-950 bg-slate-100">
        {getInitial("Badal Praksh")}
      </div>
      <div className="">
        <p className="text-sm font-medium">Badal</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileInfo;
