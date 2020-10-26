const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const db = require('../../config/dbconfig');
const moment = require('moment');

// get all doctor list
router.get('/', async (req, res) => {
    try {
        let doctors = await db.getDb().collection('doctors').find().toArray()
        res.status(200).send({
            success: true,
            doctors
        })
    } catch (error) {
        res.status(404).send({ 
            error,
            message: "Error in getting the doctor list"
        })
    }
})

// adding a new doctor
router.post('/addDoctor', async (req, res) => {
    try {
        let data = {
            _id: uuid(),
            doctorName: req.body.doctorName,
            speciality: req.body.speciality,
            slotInterval: req.body.slotInterval,
            startingTime: moment(req.body.startingTime).utc().toISOString(),
            endTime: moment(req.body.endTime).utc().toISOString(),
            timestamp: new Date().toISOString(),
        }

        let insertedDoc = await db.getDb().collection('doctors').insertOne(data)
        res.status(200).send({
            success: true,
            interted: insertedDoc.ops[0]
        })
    } catch(error) {
        res.status(500).send({ 
            error,
            message: "Could not add doctor"
        })
    }
})

module.exports = { doctorRoute: router }