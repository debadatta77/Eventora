const Booking = require("../models/booking");
const OTP = require("../models/OTP");
const Event = require("../models/event");
const { sendOTPEmail, sendBookingEmail } = require("../utils/email");

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

//send OTP for booking confirmation
exports.sendBookingOtp = async (req, res) => {
  const otp = generateOTP();
  await OTP.deleteMany({
    email: req.user.email,
    action: "event_booking",
  });

  // Create a new OTP record
  await OTP.create({
    email: req.user.email,
    otp: otp,
    action: "event_booking",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
  });

  // Send the OTP to the user's email
  await sendOTPEmail(req.user.email, otp, "event_booking");
  res.status(200).json({ message: "OTP sent successfully" });
};

// Book an event
exports.bookEvent = async (req, res) => {
  const { eventId, otp } = req.body;
  const otpRecord = await OTP.findOne({
    email: req.user.email,
    action: "event_booking",
    otp: otp,
  });

  // Check if the OTP is valid and not expired
  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  //find the event by ID and check if it exists and has available seats
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.availableSeats <= 0) {
    return res
      .status(400)
      .json({ message: "No available seats for this event" });
  }

  //check if the user has already booked the event
  const existingBooking = await Booking.findOne({
    userId: req.user._id,
    eventId: eventId,
  });

  if (existingBooking) {
    return res
      .status(400)
      .json({ message: "You have already booked this event" });
  }

  //create a new booking with status "pending" and paymentStatus "nonpaid"
  const booking = await Booking.create({
    userId: req.user._id,
    eventId: eventId,
    amount: event.ticketPrice,
    status: "pending",
    paymentStatus: "nonpaid",
  });

  //delete the OTP after successful booking
  await OTP.deleteMany({ email: req.user.email, action: "event_booking" });

  //send booking creation confirmation email to user
  res.status(201).json({
    message:
      "Booking created successfully, please check your email for confirmation",
    booking,
  });
};

//confirm booking after payment

exports.confirmBooking = async (req, res) => {
  //validate payment status
  const paymentStatus = req.body.paymentStatus;
  if (!["paid", "nonpaid"].includes(paymentStatus)) {
    return res.status(400).json({ message: "Invalid payment status" });
  }

  //find the booking by ID and check if it exists and is in "confirmed" status
  const booking = await Booking.findById(req.params.id)
    .populate("eventId")
    .populate("userId");
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  //check if the booking is already confirmed
  if (booking.status === "confirmed") {
    return res.status(400).json({ message: "Booking is already confirmed" });
  }

  //check if the event has available seats
  const event = await Event.findById(booking.eventId._id);
  if (event.availableSeats <= 0) {
    return res
      .status(400)
      .json({ message: "No available seats for this event" });
  }

  //update the booking status to "confirmed" and paymentStatus to "paid" if payment is successful
  booking.status = "confirmed";

  //update paymentStatus if provided
  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
  }
  await booking.save();
  event.availableSeats -= 1;
  await event.save();

  //after admin confirms
  //send booking confirmation email
  await sendBookingEmail(
    booking.userId.email,
    booking.userId.name,
    booking.eventId.title,
  );

  //send booking confirmation response to user
  res.status(200).json({
    message: "Booking confirmed successfully",
    booking,
  });
};

//get all bookings for a user

exports.getMyBookings = async (req, res) => {
  const query = req.user.role === "admin" ? {} : { userId: req.user._id };
  const bookings = await Booking.find(query)
    .populate("eventId")
    .populate("userId", "name email role");
  res.json(bookings);
};

//cancel a booking
exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const isOwner = booking.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ message: "You are not authorized to cancel this booking" });
  }

  const wasConfirmed = booking.status === "confirmed";
  booking.status = "cancelled";
  await booking.save();

  if (wasConfirmed) {
    const event = await Event.findById(booking.eventId);
    if (event) {
      event.availableSeats += 1;
      await event.save();
    }
  }

  res.status(200).json({ message: "Booking cancelled successfully" });
};
