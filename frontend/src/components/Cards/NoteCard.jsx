import React from "react";
import moment from "moment";
import { MdOutlinePushPin } from "react-icons/md";
import { MdEdit, MdCreate, MdDeleteForever } from "react-icons/md";
function NoteCard({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div className="">
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-sm text-slate-500">
            {moment(date).format("DD MM YYYY")}
          </span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs mt-2 text-slate-600">{content?.slice(0, 60)}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-slate-500">
          {/* {tags.map((item) => (
            <span key={item}>{`#${item}`}</span>
          ))} */}

          {tags.map((item) => `#${item}`)}
        </div>
        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600 cursor-pointer"
            onClick={onEdit}
          />
          <MdDeleteForever
            className="icon-btn hover:text-red-600 cursor-pointer"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
