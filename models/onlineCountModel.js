const moment = require('moment-timezone');
const mongoose = require('mongoose');

// Set the default timezone to Singapore
moment.tz.setDefault('Asia/Singapore');

const onlineCountSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mostOnlineToday: {
        type: Number,
        default: 0,
    },
    mostOnlineEver: {
        count: {
            type: Number,
            default: 0,
        },
        date: {
            type: Date,
            default: () => Date.now(),
        },
    },
});

onlineCountSchema.virtual('mostOnlineEverDateFormatted').get(function() {
    return moment(this.mostOnlineEver.date).tz('Asia/Singapore').format('MMM DD, YYYY hh:mm A'); 
});

const OnlineCount = mongoose.model('OnlineCount', onlineCountSchema);

module.exports = OnlineCount;