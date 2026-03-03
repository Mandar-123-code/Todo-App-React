import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// GET all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// POST create todo
router.post("/", async (req, res) => {
  try {
    const { title, description, isCompleted } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newTodo = new Todo({ title, description, isCompleted });
    const savedTodo = await newTodo.save();

    // Return the saved todo so frontend can update state immediately
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
});

// PUT update todo
router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // return updated doc
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ error: "Update failed", details: err.message });
  }
});

// DELETE todo
router.delete("/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Delete failed", details: err.message });
  }
});

export default router;
