const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String, // Used when not relying on Passport's hash storage
    required: false, // Optional if using Passport for password handling
  },
  role: {
    type: String,
    required: true,
    enum: ["buyer", "seller"],
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  resetToken: {
    type: String, // Stores the token for resetting passwords
  },
  resetTokenExpiry: {
    type: Date, // Expiry time for the reset token
  },
});

// Integrate Passport-Local Mongoose for authentication handling
userSchema.plugin(passportLocalMongoose);

// Export the model
module.exports = mongoose.model("User", userSchema);
