const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  totalCapacity: {
    type: Number,
    required: true,
  },
  bookedCount: {
    type: Number,
    default: 0,
  },
});

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    slots: [slotSchema],
  },
  {
    timestamps: true,
  }
);

experienceSchema.index({ title: 1, location: 1 });

module.exports = mongoose.model("Experience", experienceSchema);
