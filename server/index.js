const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const morgan = require('morgan')

// Database configuration file
const db = require('./config/dbconfig')

// Check the environment where the project is running
const env = process.env.NODE_ENV || 'prod'

//Routes file configuration
const { bookingRoute } = require('./routes/booking/index');
const { doctorRoute }  = require('./routes/doctor/index');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send("Hello World");
})

//Route for booking
app.use('/booking', bookingRoute)

// Route for doctor
app.use('/doctor', doctorRoute)


// Database Connection
db.connect((err) => {
    if (err) {
        console.log('Unable to connect to the database!');
    } else {
        const port = process.env.port || 3001
        app.listen(port, () => {
            console.log(`Database connection established and server is running on ${port}`)
        })
    }
})