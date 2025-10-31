const express = require("express");
const router = express.Router();
const Experience = require("../db/schema/Experience");

// GET /api/experiences - Get all experiences
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ _id: 1 });
    res.json(experiences);
    console.log("Fetched experiences:", experiences);
    
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/experiences/:id - Get experience details with available slots
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    const dateSet = new Set();
    const slotDetails = experience.slots.map((slot) => {
      const dateStr = slot.date.toISOString().split("T")[0];
      dateSet.add(dateStr);

      return {
        id: slot._id,
        date: dateStr,
        time: slot.time,
        available: slot.totalCapacity - slot.bookedCount,
        totalCapacity: slot.totalCapacity,
      };
    });

    const dates = Array.from(dateSet).sort();

    res.json({
      _id: experience._id,
      title: experience.title,
      location: experience.location,
      description: experience.description,
      fullDescription: experience.fullDescription,
      price: experience.price,
      imageUrl: experience.imageUrl,
      dates,
      slots: slotDetails,
    });
  } catch (error) {
    console.error("Error fetching experience details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
