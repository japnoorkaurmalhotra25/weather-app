const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  city: String,
  state: String,
  country: String,
  preferredUnit: {
    type: String,
    enum: ["C", "F"],
    default: "C",
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    locations: [locationSchema],

    emailNotifications: {
      dailyForecast: {
        type: Boolean,
        default: true,
      },

      weatherAlerts: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
  );

module.exports = mongoose.model("User", userSchema);