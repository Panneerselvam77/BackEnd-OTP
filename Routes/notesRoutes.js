import express from "express";
import { Notes } from "../models/notes.js";

const router = express.Router();

// Get all Data Notes
router.get("/all", async (req, res) => {
  try {
    const notes = await Notes.find().populate("user", "name");
    if (!notes) {
      return res.status(400).json({ message: "Couldn't find any Info" });
    }
    res
      .status(200)
      .json({ message: "Successfully got Your data", data: notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

// Get User Data Notes
router.get("/user", async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user._id }).populate(
      "user",
      "name"
    );
    if (!notes) {
      return res.status(400).json({ message: "Couldn't find any Document" });
    }
    res
      .status(200)
      .json({ message: "Successfully got Your data", data: notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

//  Posting Data Notes
router.post("/add", async (req, res) => {
  try {
    const postDate = new Date().toJSON().slice(0, 10);
    const notes = await new Notes({
      ...req.body,
      date: postDate,
      user: req.user._id,
    }).save();
    if (!notes) {
      return res.status(200).json({ message: "Error in saving Notes" });
    }
    res.status(200).json({ message: "Notes Saved Successfully", data: notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

// Edit Data Notes
router.put("/edit/:id", async (req, res) => {
  try {
    const updateNotes = await Notes.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updateNotes) {
      return res.status(400).json({ message: "Error Occured" });
    }
    res
      .status(200)
      .json({ message: "Successfully Updated", data: updateNotes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});
// Delete Notes
router.delete("/:id", async (req, res) => {
  try {
    const deleteNotes = await Notes.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!deleteNotes) {
      return res.status(400).json({ message: "Error Occured" });
    }
    res.status(200).json({ message: "Successfully Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

export const notesRouter = router;
