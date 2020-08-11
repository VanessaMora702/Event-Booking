const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../helpers/date');


const user = userId => {
    return User.findById(userId).then(user => {
        return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents)}
     }).catch(error => {
        throw err
    })
}

// USING ASYNC AND AWAIT INSTEAD OF THEN AND CATCH 
const events = async eventIds => {
    try {
    const events = await Event.find({ _id: { $in: eventIds }})
    return events.map(event => {
            return transformEvent(event)
        });
     } catch (error) {
         throw error;
     }
}

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id, 
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event)
    } catch (err) {
        throw err;
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc, 
        _id: booking.id, 
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    }
}

//  THEN AND CATCH
// const events = eventIds => {
//     return Event.find({_id: {$in: eventIds}}).then(events => {
//         return events.map(event => {
//             return {...event._doc,
//                  _id: event.id, 
//                  date: new Date(event._doc.date).toISOString(),
//                  creator: user.bind(this, event.creator)}
//         })
//      }).catch(error => {
//         throw error;
//     })
// }

// exports.user = user
// // exports.events = events;
// exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent
exports.transformBooking = transformBooking