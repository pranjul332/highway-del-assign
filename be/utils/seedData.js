const Experience = require("../db/schema/Experience");

const seedData = async () => {
  try {
    const count = await Experience.countDocuments();

    if (count === 0) {
      const experiences = [
        {
          title: "Kayaking",
          location: "Udupi",
          description:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          fullDescription:
            "Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.",
          price: 999,
          imageUrl:
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          slots: [],
        },
        {
          title: "Nandi Hills Sunrise",
          location: "Bangalore",
          description:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          fullDescription:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          price: 899,
          imageUrl:
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
          slots: [],
        },
        {
          title: "Coffee Trail",
          location: "Coorg",
          description:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          fullDescription:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          price: 1299,
          imageUrl:
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
          slots: [],
        },
        {
          title: "Kayaking",
          location: "Udupi, Karnataka",
          description:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          fullDescription:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          price: 999,
          imageUrl:
            "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800",
          slots: [],
        },
        {
          title: "Boat Cruise",
          location: "Sunderban",
          description:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          fullDescription:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          price: 999,
          imageUrl:
            "https://images.unsplash.com/photo-1544551763-92f5f1b1b5d8?w=800",
          slots: [],
        },
        {
          title: "Bunjee Jumping",
          location: "Manali",
          description:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          fullDescription:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          price: 999,
          imageUrl:
            "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800",
          slots: [],
        },
        {
          title: "Coffee Trail",
          location: "Coorg",
          description:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          fullDescription:
            "Curated small-group experience. Certified guide. Safety first with gear included.",
          price: 1299,
          imageUrl:
            "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800",
          slots: [],
        },
      ];

      // Generate slots for each experience
      const dates = [
        "2025-10-22",
        "2025-10-23",
        "2025-10-24",
        "2025-10-25",
        "2025-10-26",
      ];
      const times = [
        { time: "07:00 am", capacity: 6 },
        { time: "09:00 am", capacity: 4 },
        { time: "11:00 am", capacity: 8 },
        { time: "01:00 pm", capacity: 5 },
      ];

      experiences.forEach((exp) => {
        const numDates = Math.floor(Math.random() * 3) + 3;
        const numTimes = Math.floor(Math.random() * 2) + 2;

        for (let i = 0; i < numDates; i++) {
          for (let j = 0; j < numTimes; j++) {
            exp.slots.push({
              date: new Date(dates[i]),
              time: times[j].time,
              totalCapacity: times[j].capacity,
              bookedCount: 0,
            });
          }
        }
      });

      await Experience.insertMany(experiences);
      console.log("Database seeded with initial data");
    } else {
      console.log("Database already contains data, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

module.exports = seedData;
