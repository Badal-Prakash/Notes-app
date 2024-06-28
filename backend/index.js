const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const User = require("./models/user.model");
const Note = require("./models/notes.model");
const notesController = require("./controller/notesController");
const userController = require("./controller/userController");
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
app.get("/users", userController.getAllUsers);
app.get("/user", authenticateToken, userController.getUser);
app.post("/signup", userController.createAccount);
app.post("/login", userController.login);
app.post("/add-notes", authenticateToken, notesController.addNote);
app.put("/edit-note/:id", authenticateToken, notesController.editNotes);
app.get("/all-notes", authenticateToken, notesController.getAllNote);
app.delete("/delete-note/:id", authenticateToken, notesController.deleteNotes);
app.put("/update-ispinned/:id", authenticateToken, notesController.updateNote);
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
module.exports = app;
