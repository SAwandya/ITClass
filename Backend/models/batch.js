const req = require("express/lib/request");
const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const batchSchema = new mongoose.Schema({
  day: {
    type: String,
    require: true,
  },
  medium: {
    type: String,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
});

const Batch = mongoose.model("Batch", batchSchema);

function validateBatch(batch) {
  const schema = Joi.object({
    day: Joi.string().required(),
    medium: Joi.string().required(),
    year: Joi.string().required(),
  });

  var result = schema.validate(batch);

  return result;
}

exports.Batch = Batch;
exports.validate = validateBatch;
