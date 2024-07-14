const Note = require("./../models/notes.model");
exports.getAllNote = async (req, res) => {
  try {
    const { user } = req.user;
    const notes = await Note.find({ userId: user._id }).sort({
      isPinned: -1,
    });
    if (notes) {
      return res.status(200).json({
        length: notes.length,
        status: "success",
        notes,
      });
    } else {
      return res.status(200).json({
        length: notes.length,
        status: "success",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteNotes = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;

    const note = await Note.findOne({ _id: id, userId: user.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    await Note.deleteOne({ _id: id, userId: user.user._id });
    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateNote = async (req, res) => {
  const id = req.params.id;
  const { isPinned } = req.body;
  const user = req.user;
  if (typeof isPinned === "undefined") {
    return res.status(400).json({ message: "No changes provided" });
  }
  try {
    const note = await Note.findOne({ _id: id, userId: user.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.isPinned = isPinned;
    await note.save();
    return res.status(200).json({
      status: "success",
      note,
      message: "Note pinned status updated successfully",
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.editNotes = async (req, res) => {
  const id = req.params.id;
  const { title, content, tags, isPinned } = req.body;
  const user = req.user;
  if (!title && !content && !tags && typeof isPinned === "undefined") {
    return res.status(400).json({ message: "No changes provided" });
  }
  try {
    const note = await Note.findOne({ _id: id, userId: user.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (typeof isPinned !== "undefined") note.isPinned = isPinned;
    await note.save();
    return res.status(200).json({
      status: "success",
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addNote = async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(404).json({ message: "No title provided" });
  }
  if (!content) {
    return res.status(404).json({ message: "No content provided" });
  }
  try {
    const newNote = await Note.create({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });
    newNote.save();
    return res
      .status(200)
      .json({ status: "success", message: "New note created", newNote });
  } catch (error) {
    res.status(404).json({ message: "internal server error", error });
  }
};
