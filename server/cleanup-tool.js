const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Booking = require("./models/booking");
const Event = require("./models/event");

dns.setServers(["1.1.1.1", "1.0.0.1"]);
dotenv.config();

const run = async () => {
  const action = process.argv[2];

  if (!action || (action !== "fix" && action !== "clear")) {
    console.log("Usage: node cleanup-tool.js [fix|clear]");
    console.log("  fix   - Rename 'ammount' to 'amount' on existing bookings to fix NaN revenue.");
    console.log("  clear - Delete all booking data and reset event seats.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    if (action === "fix") {
      // Option A: Fix ammount typo to amount
      const result = await Booking.updateMany(
        { ammount: { $exists: true } },
        { $rename: { ammount: "amount" } }
      );
      console.log(`Successfully renamed 'ammount' to 'amount' in ${result.modifiedCount} bookings!`);
    } else if (action === "clear") {
      // Option B: Clear bookings and reset seats
      const deleteResult = await Booking.deleteMany({});
      console.log(`Deleted all ${deleteResult.deletedCount} bookings.`);

      const events = await Event.find({});
      for (const event of events) {
        event.availableSeats = event.totalSeats;
        await event.save();
      }
      console.log("Reset available seats on all events back to their maximum capacity.");
    }

    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Error running script:", error);
    process.exit(1);
  }
};

run();
