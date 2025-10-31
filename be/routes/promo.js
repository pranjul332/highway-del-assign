// routes/promo.js - Promo Code Routes
const express = require("express");
const router = express.Router();

// Promo codes configuration
const promoCodes = {
  SAVE10: { type: "percentage", value: 10, description: "10% off" },
  FLAT100: { type: "flat", value: 100, description: "₹100 off" },
};

// POST /api/promo/validate - Validate promo code
router.post("/validate", async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || subtotal === undefined) {
    return res
      .status(400)
      .json({ valid: false, message: "Missing required fields" });
  }

  const promo = promoCodes[code.toUpperCase()];

  if (!promo) {
    return res
      .status(400)
      .json({ valid: false, message: "Invalid promo code" });
  }

  let discount = 0;
  if (promo.type === "percentage") {
    discount = Math.round((subtotal * promo.value) / 100);
  } else {
    discount = promo.value;
  }

  res.json({
    valid: true,
    discount,
    description: promo.description,
  });
});

module.exports = router;
