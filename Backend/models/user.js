const req = require("express/lib/request");
const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
  },
  school: {
    type: String,
  },
  batch: {
    type: String,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    default: "student",
  },
});

// Create partial indexes for googleId and facebookId
// userSchema.index(
//   { googleId: 1 },
//   { unique: true, partialFilterExpression: { googleId: { $type: "string" } } }
// );
// userSchema.index(
//   { facebookId: 1 },
//   { unique: true, partialFilterExpression: { facebookId: { $type: "string" } } }
// );

const User = mongoose.model("User", userSchema);

function validateAdmin(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().min(3).max(50),
    password: Joi.string().min(3).max(255).required(),
    school: Joi.string(),
    batch: Joi.string(),
    phone: Joi.string(),
    role: Joi.string(),
    userId: Joi.string(),
  });

  var result = schema.validate(user);

  return result;
}

exports.User = User;
exports.validate = validateAdmin;
