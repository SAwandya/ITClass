const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
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
    email: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(3).max(255),
    role: Joi.string(),
  });

  var result = schema.validate(user);

  return result;
}

exports.User = User;
exports.validate = validateAdmin;
