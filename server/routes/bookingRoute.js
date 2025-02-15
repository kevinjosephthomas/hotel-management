const express = require("express");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const Booking = require("../models/booking");
const Room = require("../models/room");

router.post("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;
  try {
    const booking = await Booking.findOne({ _id: bookingid });

    booking.status = "cancelled";
    await booking.save();
    const room = await Room.findOne({ _id: roomid });
    const bookings = room.currentbookings;
    const temp = bookings.filter((x) => x.bookingid.toString() !== bookingid);
    room.currentbookings = temp;
    await room.save();

    res.send("Your booking cancelled successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/getbookingbyuserid", async (req, res) => {
  const { userid } = req.body;
  try {
    const bookings = await Booking.find({ userid: userid });

    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/bookroom", async (req, res) => {
  try {
    const { room, userid, fromdate, todate, totalAmount, totaldays } = req.body;

    // Directly create a booking without payment processing
    const newBooking = new Booking({
      room: room.name,
      roomid: room._id,
      userid,
      fromdate: moment(fromdate).format("DD-MM-YYYY"),
      todate: moment(todate).format("DD-MM-YYYY"),
      totalamount: totalAmount,
      totaldays,
      transactionid: uuidv4(),
    });

    const booking = await newBooking.save();

    const roomTmp = await Room.findOne({ _id: room._id });
    roomTmp.currentbookings.push({
      bookingid: booking._id,
      fromdate: moment(fromdate).format("DD-MM-YYYY"),
      todate: moment(todate).format("DD-MM-YYYY"),
      userid: userid,
      status: booking.status,
    });

    await roomTmp.save();
    res.send("Your Room is booked successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;