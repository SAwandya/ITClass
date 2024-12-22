const express = require("express");
const router = express.Router();
const { Batch, validate } = require("../models/batch"); // Adjust the path based on your file structure

// Create a new batch
router.post("/", async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create a new batch
  const batch = new Batch({
    day: req.body.day,
    medium: req.body.medium,
    year: req.body.year,
  });

  try {
    await batch.save();
    res.status(201).send(batch);
  } catch (err) {
    res.status(500).send("Error creating batch: " + err.message);
  }
});

// Get all batches
router.get("/", async (req, res) => {
  try {
    const batches = await Batch.find();
    res.send(batches);
  } catch (err) {
    res.status(500).send("Error fetching batches: " + err.message);
  }
});

// Get a specific batch by ID
router.get("/:id", async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).send("Batch not found");
    res.send(batch);
  } catch (err) {
    res.status(500).send("Error fetching batch: " + err.message);
  }
});

// Update a batch by ID
router.put("/:id", async (req, res) => {
  // Validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      {
        day: req.body.day,
        medium: req.body.medium,
        year: req.body.year,
      },
      { new: true } // Return the updated document
    );

    if (!batch) return res.status(404).send("Batch not found");

    res.send(batch);
  } catch (err) {
    res.status(500).send("Error updating batch: " + err.message);
  }
});

// Delete a batch by ID
router.delete("/:id", async (req, res) => {
  try {
    const batch = await Batch.findByIdAndRemove(req.params.id);
    if (!batch) return res.status(404).send("Batch not found");
    res.send(batch);
  } catch (err) {
    res.status(500).send("Error deleting batch: " + err.message);
  }
});

module.exports = router;
