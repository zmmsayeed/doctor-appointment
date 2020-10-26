const moment = require('moment')

module.exports = {
    getTimeInternvals: function (start, end, interval) {
        var startTime = moment(start).utc();
        var endTime = moment(end).utc();

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