const express = require("express");
require("dotenv").config();
const cors = require("cors");
const User = require("./models/user.model");
const Note = require("./models/notes.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utils");
mongoose.connect(process.env.CONNECTION_STRING).then(() => {
  console.log("Connecting to database");
});
const app = express();
app.use(express.json());

app.use(cors({ origin: "*" }));
const port = 3000;
app.get("/", (req, res) => {
  res.json({
    data: "hello world",
  });
});
app.get("/users", async (req, res) => {
  const user = await User.find();
  return res.status(200).json({
    user,
  });
});
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res
      .status(404)
      .json({ status: "failed", message: "Please enter fullName" });
  }
  if (!email) {
    return res
      .status(404)
      .json({ status: "failed", message: "Please enter valid email" });
  }

  if (!password) {
    return res
      .status(404)
      .json({ status: "failed", message: "Please enter password" });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res
      .status(404)
      .json({ status: "failed", message: "user already exist" });
  }
  const newUser = await User.create({ fullName, email, password });
  newUser.save();

  const accessToken = jwt.sign({ newUser }, process.env.SECRET_KEY, {
    expiresIn: "36000m",
  });
  return res.status(200).json({
    status: "success",
    newUser,
    accessToken,
    message: "user created successfully",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!password) {
    return res
      .status(404)
      .json({ status: "error", message: "enter your password" });
  }
  if (!email) {
    return res
      .status(404)
      .json({ status: "error", message: "enter valid email" });
  }

  const userInfo = await User.findOne({ email });
  if (!userInfo) {
    return res.status(404).json({ status: "error", message: "user not found" });
  }
  if (userInfo.email === email && userInfo.password === password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.SECRET_KEY, {
      expiresIn: "3600m",
    });

    return res.json({
      status: "success",
      message: "Login successful",
      email,
      accessToken,
    });
  } else {
    return res.json({
      status: "failed",
      message: "Invald credentials",
    });
  }
});

app.post("/add-notes", authenticateToken, async (req, res) => {
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
});
app.put("/edit-note/:id", authenticateToken, async (req, res) => {
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
});

app.get("/all-notes", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const notes = await Note.find({ userId: user.user._id }).sort({
      isPinned: -1,
    });
    return res.status(200).json({
      length: notes.length,
      status: "success",
      notes,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delete-note/:id", authenticateToken, async (req, res) => {
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
});
app.put("/update-ispinned/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { isPinned } = req.body;
  const user = req.user;

  // Check if isPinned is provided in the request body
  if (typeof isPinned === "undefined") {
    return res.status(400).json({ message: "No changes provided" });
  }

  try {
    // Find the note by id and user id
    const note = await Note.findOne({ _id: id, userId: user.user._id });

    // If note not found, return 404
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update the isPinned status
    note.isPinned = isPinned;

    // Save the updated note
    await note.save();

    // Return success response
    return res.status(200).json({
      status: "success",
      note,
      message: "Note pinned status updated successfully",
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
module.exports = app;
