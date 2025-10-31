const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../db/schema/Booking");
const Experience = require("../db/schema/Experience");

// POST /api/bookings - Create a new booking
router.post("/", async (req, res) => {
  const {
    experienceId,
    slotId,
    date,
    time,
    quantity,
    fullName,
    email,
    promoCode,
    discountAmount,
    subtotal,
    taxes,
    total,
  } = req.body;

  // Validation
  if (!experienceId || !date || !time || !quantity || !fullName || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the experience
    const experience = await Experience.findById(experienceId).session(session);

    if (!experience) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Experience not found" });
    }

    // Find the specific slot
    const slot = experience.slots.id(slotId);

    if (!slot) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Slot not found" });
    }

    // Check availability
    const available = slot.totalCapacity - slot.bookedCount;
    if (available < quantity) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "Insufficient availability",
        available,
        requested: quantity,
      });
    }

    // Update slot booking count
    slot.bookedCount += quantity;
    await experience.save({ session });

    // Create booking
    const booking = new Booking({
      experienceId,
      slotId,
      fullName,
      email,
      quantity,
      date: new Date(date),
      time,
      promoCode: promoCode || null,
      discountAmount: discountAmount || 0,
      subtotal,
      taxes,
      total,
    });

    await booking.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      booking,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  } finally {
    session.endSession();
  }
});

// GET /api/bookings/:id - Get booking details
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id).populate(
      "experienceId",
      "title location"
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      ...booking.toObject(),
      title: booking.experienceId.title,
      location: booking.experienceId.location,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
