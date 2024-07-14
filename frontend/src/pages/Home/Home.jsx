import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddeditNotes from "./AddeditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../utils/Axios";

function Home() {
  const [openAddEditmodal, setopenAddEditmodal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allnotes, setallNotes] = useState([]);

  const getUserInfo = async () => {
    try {
      const response = await AxiosInstance.get("/user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const getallNotes = async () => {
    try {
      const response = await AxiosInstance.get("/all-notes");
      {
        console.log(response.data);
      }
      if (response.data && response.data.notes) {
        setallNotes(response.data.notes);
      }
    } catch (error) {
      console.log("an unexpected error occurred:", error);
    }
  };
  useEffect(() => {
    getallNotes();
    getUserInfo();
    return () => {};
  }, []);
  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {allnotes.map((note) => (
            <NoteCard
              key={note._id}
              title={note.title}
              date={note.created_on}
              content={note.content}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => {}}
              onDelete={() => {}}
              onPinNote={() => {}}
            />
          ))}
        </div>
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setopenAddEditmodal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditmodal.isShown}
        onRequestclose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddeditNotes
          type={openAddEditmodal.type}
          noteData={openAddEditmodal.data}
          onClose={() => {
            setopenAddEditmodal({ isShown: false, type: "add", data: null });
          }}
        />
      </Modal>
    </>
  );
}

export default Home;
