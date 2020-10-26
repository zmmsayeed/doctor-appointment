const moment = require('moment')

module.exports = {
    getTimeInternvals: function (date, start, end, interval) {
        let startTime = moment(date + ' ' + start, 'DD/MM/YYYY HH:mm').utc();
        let endTime = moment(date + ' ' + end, 'DD/MM/YYYY HH:mm').utc();

        if (endTime.isBefore(startTime)) {
            endTime.add(1, 'day');
        }

        var timeIntervals = [];
        while (startTime <= endTime) {
            timeIntervals.push(moment(startTime).utc());
            startTime.add(interval, 'minutes');
        }
        return timeIntervals;
    },

    availableSlots: function (allSlots, bookedSlots) {
        let newArr = [];

        let all_slots = allSlots.map(s => moment(s).utc().toISOString());

        let booked_slots = [];
        bookedSlots.map(b => booked_slots.push(moment(b.slotBooked).utc().toISOString()))

        all_slots.map(slot => {
            booked_slots.includes(slot) ? null : newArr.push(slot)
        })

        return newArr;
    }
}