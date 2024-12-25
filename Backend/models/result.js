const req = require("express/lib/request");
const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "batch",
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exam",
    required: true,
  },
  marks: {
    type: String,
    required: true,
  },
});

const Result = mongoose.model("Result", resultSchema);

function validateResult(result) {
  const schema = Joi.object({
    student: Joi.string().required(),
    batch: Joi.string().required(),
    exam: Joi.string().required(),
    marks: Joi.string().required(),
  });

  var result = schema.validate(result);

  return result;
}

exports.Result = Result;
exports.validate = validateResult;
