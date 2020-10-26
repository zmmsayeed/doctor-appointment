const express = require('express');
const router = express.Router();
const db = require('../../config/dbconfig');
const { getTimeInternvals, availableSlots } = require('../../Utils');
const moment = require('moment');
const { v4: uuid } = require('uuid');

// let startDate    = "2020-10-26T10:09:49.414Z";
// let endDate      = "2020-10-26T18:30:00.000Z";
// let slotInterval = 45; // In minutes

router.post('/', async (req, res) => {
    try {
        let doctorId = req.body.doctorId;
        let doctorFound = await db.getDb().collection('doctors').findOne({ _id: doctorId });

        if (doctorFound) {
            let startDate = doctorFound.startingTime;
            let endDate = doctorFound.endTime;
            let slotInterval = doctorFound.slotInterval;

            // find all booking for the doctor
            let allDocBookings = await db.getDb().collection('bookings').find({ doctorId }).toArray();
            
            // Find all intervals between the given the timespan
            let intervals = getTimeInternvals(startDate, endDate, slotInterval);

            // Find all slots exclusive of the booked slots
            let availSlots = availableSlots(intervals, allDocBookings)

            res.status(200).send({
                success: true,
                // intervals: intervals,
                availSlots: availSlots
            })
        }
    } catch (error) {
        res.status(500).send({
            error: error,
            message: "Error in getting the slots"
        })
    }
})

router.post('/addSlot', async (req, res) => {
    try {
        // let intervals = getTimeInternvals(startDate, endDate, slotInterval);
        let data = {
            _id: uuid(),
            doctorId: req.body.doctorId,
            slotBooked: moment(req.body.slotBooked).utc().toISOString(),
            patientName: req.body.patientName
        }

        let insertedSlot = await db.getDb().collection('bookings').insertOne(data)

        res.status(200).send({
            success: true,
            insertedSlot: insertedSlot.ops[0]
        })
    } catch (error) {
        res.status(500).send({
            error: error,
            message: "Error hogaya"
        })
    }
})

module.exports = { bookingRoute: router }