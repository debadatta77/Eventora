const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const dns = require("dns");
const User = require("./models/User");
const Event = require("./models/Event");
const Booking = require("./models/Booking");

dns.setServers(["1.1.1.1", "1.0.0.1"]);

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@eventora.com",
    password: "password123",
    role: "admin",
  },
  {
    name: "Demo User",
    email: "user@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Alice Smith",
    email: "alice@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Bob Johnson",
    email: "bob@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Charlie Dave",
    email: "charlie@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Diana Prince",
    email: "diana@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Ethan Hunt",
    email: "ethan@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Fiona Gallagher",
    email: "fiona@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "George Miller",
    email: "george@eventora.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Hannah Montana",
    email: "hannah@eventora.com",
    password: "password123",
    role: "user",
  },
];

const events = [
  {
    title: "React & Node.js Developer Retreat",
    description:
      "Join us for a 3-day deep dive into modern full-stack web development. Perfect for developers looking to take their skills to the next level.",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    location: "Silicon Valley Innovation Center, CA",
    category: "Technology",
    totalSeats: 200,
    ticketPrice: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Neon Nights EDM Festival",
    description:
      "Experience an unforgettable night of EDM, techno, and dazzling light shows with top DJs from around the globe.",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    location: "Grand Arena, New York",
    category: "Music",
    totalSeats: 500,
    ticketPrice: 1500,
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Global Leaders Business Summit",
    description:
      "A premium gathering of CEOs, founders, and investors discussing the future of global commerce and AI integration.",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    location: "The Ritz-Carlton, London",
    category: "Business",
    totalSeats: 150,
    ticketPrice: 5000,
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Modern Art Expo 2024",
    description:
      "Discover breathtaking contemporary and modern arts from underground and trending artists this season.",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: "Downtown Art Museum",
    category: "Art",
    totalSeats: 300,
    ticketPrice: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Startup Pitch & Pitch Competition",
    description:
      "Watch 25 startups pitch for 1 million dollars in seed funding. Great networking for entrepreneurs and angel investors.",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    location: "Convention Center, Miami",
    category: "Business",
    totalSeats: 250,
    ticketPrice: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Cloud Computing Architecture Seminar",
    description:
      "A purely technical breakdown of scalable cloud solutions, multi-region routing, and serverless compute processing.",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    location: "Tech Hub, Seattle",
    category: "Technology",
    totalSeats: 100,
    ticketPrice: 600,
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Gastronomy & Wine Pairing Masterclass",
    description:
      "Savor exquisite gourmet dishes paired with award-winning vintage wines, curated by world-renowned Michelin-star chefs.",
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    location: "Grand Hyatt Culinary Center, Paris",
    category: "Food",
    totalSeats: 50,
    ticketPrice: 2500,
    imageUrl:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "International Film & Cinema Festival",
    description:
      "An exclusive screening of groundbreaking independent films, documentaries, and short films followed by director Q&A sessions.",
    date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    location: "Starlight Cinema Theatre, Los Angeles",
    category: "Entertainment",
    totalSeats: 120,
    ticketPrice: 800,
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Ultimate Fitness & CrossFit Championship",
    description:
      "Watch elite athletes compete in high-intensity workouts, strength challenges, and endurance tests for the national title.",
    date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    location: "Metro Fit Arena, Chicago",
    category: "Sports",
    totalSeats: 350,
    ticketPrice: 300,
    imageUrl:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Mindfulness & Yoga Wellness Retreat",
    description:
      "Recharge your mind and body with guided meditation, restorative yoga sessions, and organic nutrition workshops.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    location: "Serenity Eco-Resort, Bali",
    category: "Health",
    totalSeats: 80,
    ticketPrice: 1200,
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Future of AI Robotics Exhibition",
    description:
      "Get hands-on with next-generation humanoid robots, autonomous systems, and advanced AI automation displays.",
    date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
    location: "Expo Science Plaza, Tokyo",
    category: "Technology",
    totalSeats: 400,
    ticketPrice: 400,
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Acoustic Sunset Beach Session",
    description:
      "Unwind at sunset with soothing live acoustic sets from local singer-songwriters right by the beach bonfire.",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: "Paradise Cove Beach, Malibu",
    category: "Music",
    totalSeats: 150,
    ticketPrice: 150,
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800",
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/eventora";

    await mongoose.connect(mongoUri);
    console.log("\n✅ MongoDB connection open...");

    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();
    console.log("🗑️  Cleared existing data.");

    // Hash user passwords
    const salt = await bcrypt.genSalt(10);
    const hashedUsers = users.map((u) => ({
      ...u,
      password: bcrypt.hashSync(u.password, salt),
      isVerified: true,
    }));

    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers.find((u) => u.role === "admin");
    const normalUsers = createdUsers.filter((u) => u.role === "user");
    console.log(`👤 Created ${createdUsers.length} total dummy users.`);

    // Link events to admin
    const eventsWithAdmin = events.map((e) => ({
      ...e,
      availableSeats: e.totalSeats,
      createdBy: adminUser._id,
    }));

    const createdEvents = await Event.insertMany(eventsWithAdmin);
    console.log(
      `🎉 Created ${createdEvents.length} distinct events with Unsplash images.`,
    );

    if (process.argv.includes("--with-bookings")) {
      // Generate Bookings Data
      const bookingsData = [];

      for (const event of createdEvents) {
        // Assign 3-6 random users to each event
        const randomCount = Math.floor(Math.random() * 4) + 3;
        // Shuffle and pick random users
        const shuffledUsers = [...normalUsers].sort(() => 0.5 - Math.random());
        const selectedUsers = shuffledUsers.slice(0, randomCount);

        for (const user of selectedUsers) {
          // Randomize statuses
          const statuses = ["pending", "confirmed", "cancelled"];
          const status = statuses[Math.floor(Math.random() * statuses.length)];

          let paymentStatus = "nonpaid";
          if (status === "confirmed" && event.ticketPrice > 0) {
            // Usually confirmed tickets are marked paid (90% of the time)
            paymentStatus = Math.random() > 0.1 ? "paid" : "nonpaid";
          } else if (event.ticketPrice === 0) {
            paymentStatus = "paid";
          }

          bookingsData.push({
            userId: user._id,
            eventId: event._id,
            status: status,
            paymentStatus: paymentStatus,
            amount: event.ticketPrice,
          });

          // Deduct available seats specifically for confirmed tickets!
          if (status === "confirmed") {
            event.availableSeats -= 1;
            await event.save();
          }
        }
      }

      await Booking.insertMany(bookingsData);
      console.log(
        `🎫 Inserted ${bookingsData.length} randomized dummy bookings (confirmed, pending, cancelled, paid, nonpaid).`,
      );
    } else {
      console.log("ℹ️  Skipping booking generation (run with --with-bookings to include them).");
    }

    console.log("\n🚀 Database seeded successfully!");
    console.log("-------------------------------------------");
    console.log("Admin Email: admin@eventora.com");
    console.log("User Email:  user@eventora.com");
    console.log("Password for all users: password123");
    console.log("-------------------------------------------\n");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
