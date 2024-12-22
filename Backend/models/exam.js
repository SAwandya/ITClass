const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const examSchema = new mongoose.Schema({
  additionalInfo: {
    type: String,
  },
  examDate: {
    type: Date,
    minlength: 3,
    maxlength: 50,
  },
  examName: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  topics: {
    type: String,
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
});

const Exam = mongoose.model("Exam", examSchema);

function validateExam(exam) {
  const schema = Joi.object({
    additionalInfo: Joi.string().required(),
    examDate: Joi.date().required(),
    examName: Joi.string().required(),
    topics: Joi.string().required(),
    batch: Joi.string().required(),
  });

  var result = schema.validate(exam);

  return result;
}

exports.Exam = Exam;
exports.validate = validateExam;
