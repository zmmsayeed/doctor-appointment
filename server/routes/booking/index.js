const express = require('express');
const router = express.Router();
const db = require('../../config/dbconfig');
const { getTimeInternvals, availableSlots } = require('../../Utils');
const moment = require('moment');
const { v4: uuid } = require('uuid');

router.post('/', async (req, res) => {
    
    try {
        let doctorId = req.body.doctorId;
        let doctorFound = await db.getDb().collection('doctors').findOne({ _id: doctorId });

        if (doctorFound) {
            let date = req.body.date;
            let startDate = doctorFound.startingTime;
            let endDate = doctorFound.endTime;
            let slotInterval = doctorFound.slotInterval;

            // find all booking for the doctor
            let allDocBookings = await db.getDb().collection('bookings').find({ doctorId }).toArray();
            
            // Find all intervals between the given the timespan
            let intervals = getTimeInternvals(date, startDate, endDate, slotInterval);

            // Find all slots exclusive of the booked slots
            let availSlots = availableSlots(intervals, allDocBookings);

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
/*
    /addSlot should take in dateTime and duration (always in minutes)

    Example1:- I want to book a slot on 23/10/2020 11:00am for 120 minutes 
    Doctor has set his slots for half an hour
    so your data that you'll insert in firestore doc will be :-
        entry1 -> 23/10/2020 11:00-11:30
        entry2 -> 23/10/2020 11:30-12:00
        entry3 -> 23/10/2020 12:00-12:30
        entry4 -> 23/10/2020 12:30-13:00

    Example2 :- I want to book a slot on 23/10/2020 11:00am for 15 minutes
    Doctor has set his slots for half an hour
    so your data that you'll insert in firestore doc will be :-
        entry1 -> 23/10/2020 11:00-11:30 

    Example3:- I want to book a slot on 23/10/2020 11:00am for 75 minutes
    Doctor has set his slots for half an hour
    so your data that you'll insert in firestore doc will be :-
        entry1 -> 23/10/2020 11:00-11:30
        entry2 -> 23/10/2020 11:30-12:00
        entry3 -> 23/10/2020 12:00-12:30

    Return 200 if slots are booked successfully, if not, return 422

    What can be done:
    current logic written for /addSlot can be used when user is selecting slot from list of available slots shown in the UI
    
    The above mentioned logic can be added in another function with /createCustomEvent 
        There will be a button on the UI which says "Create Custom Event"
        On click will open up modal which can have fields to take dateTime and duration. 
        This data is used to call createCustomEvent API

    Validation :-
    Upon receiving the dateTime, validation should be performed to ensure that the requested slots are free and 
    do not fall outside of the doctor's start and end time.
    
*/ 
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