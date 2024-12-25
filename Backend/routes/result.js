const express = require("express");
const mongoose = require("mongoose");
const { Result, validate } = require("../models/result");
const { Batch } = require("../models/batch");
const { Exam } = require("../models/exam");
const { User } = require("../models/user");
const Joi = require("joi");

const router = express.Router();

/**
 * Add Result
 * Endpoint: POST /api/results
 */
router.post("/", async (req, res) => {

  const { examId, batchId, marks } = req.body;

  // Validate batch and exam existence
  const batch = await Batch.findById(batchId);
  if (!batch) return res.status(404).send("Batch not found");

  const exam = await Exam.findById(examId);
  if (!exam) return res.status(404).send("Exam not found");

  // Iterate over the marks object to save results for each student
  const results = [];
  for (const [studentId, mark] of Object.entries(marks)) {
    const student = await User.findById(studentId);
    if (!student)
      return res.status(404).send(`Student with ID ${studentId} not found`);

    const result = new Result({
      student: studentId,
      batch: batchId,
      exam: examId,
      marks: mark,
    });

    await result.save();
    results.push(result);
  }

  res.send(results);
});

/**
 * Get Results for a Specific Exam and Batch
 * Endpoint: GET /api/results?batchId=<batchId>&examId=<examId>
 */
router.get("/", async (req, res) => {
  const { batchId, examId } = req.query;

  if (!batchId || !examId)
    return res
      .status(400)
      .send("batchId and examId are required as query parameters");

  const results = await Result.find({ batch: batchId, exam: examId })
    .populate("student", "name") // Populate student name
    .populate("batch", "year day medium") // Populate batch details
    .populate("exam", "examName examDate"); // Populate exam details

  res.send(results);
});

/**
 * Get Results for a Specific Student
 * Endpoint: GET /api/results/student/:studentId
 */
router.get("/student/:studentId", async (req, res) => {
  const { studentId } = req.params;

  const results = await Result.find({ student: studentId })
    .populate("batch", "year day medium") // Populate batch details
    .populate("exam", "examName examDate"); // Populate exam details

  res.send(results);
});

/**
 * Update a Result
 * Endpoint: PUT /api/results/:id
 */
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const result = await Result.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!result)
    return res.status(404).send("Result with the given ID not found");

  res.send(result);
});

/**
 * Delete a Result
 * Endpoint: DELETE /api/results/:id
 */
router.delete("/:id", async (req, res) => {
  const result = await Result.findByIdAndDelete(req.params.id);

  if (!result)
    return res.status(404).send("Result with the given ID not found");

  res.send(result);
});

module.exports = router;
