const express = require("express");
const router = express.Router();
const { Exam, validate } = require("../models/exam"); // Adjust path based on your file structure
const { Batch } = require("../models/batch"); // Import the Batch model to validate the referenced batch ID

// Create a new exam
router.post("/", async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the batch ID exists
  const batch = await Batch.findById(req.body.batch);
  if (!batch) return res.status(404).send("Invalid batch ID");

  // Create a new exam
  const exam = new Exam({
    additionalInfo: req.body.additionalInfo,
    examDate: req.body.examDate,
    examName: req.body.examName,
    topics: req.body.topics,
    batch: req.body.batch,
  });

  try {
    await exam.save();
    res.status(201).send(exam);
  } catch (err) {
    res.status(500).send("Error creating exam: " + err.message);
  }
});

// Get all exams
router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find().populate("batch", "day medium year"); // Populates batch details
    res.send(exams);
  } catch (err) {
    res.status(500).send("Error fetching exams: " + err.message);
  }
});

// Get a specific exam by ID
router.get("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      "batch",
      "day medium year"
    );
    if (!exam) return res.status(404).send("Exam not found");
    res.send(exam);
  } catch (err) {
    res.status(500).send("Error fetching exam: " + err.message);
  }
});

// Update an exam by ID
router.put("/:id", async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the batch ID exists
  const batch = await Batch.findById(req.body.batch);
  if (!batch) return res.status(404).send("Invalid batch ID");

  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        additionalInfo: req.body.additionalInfo,
        examDate: req.body.examDate,
        examName: req.body.examName,
        topics: req.body.topics,
        batch: req.body.batch,
      },
      { new: true } // Return the updated document
    );

    if (!exam) return res.status(404).send("Exam not found");

    res.send(exam);
  } catch (err) {
    res.status(500).send("Error updating exam: " + err.message);
  }
});

// Delete an exam by ID
router.delete("/:id", async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).send("Exam not found");
    res.send(exam);
  } catch (err) {
    res.status(500).send("Error deleting exam: " + err.message);
  }
});

module.exports = router;
