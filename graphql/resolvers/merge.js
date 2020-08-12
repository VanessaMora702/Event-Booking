const DataLoader = require('dataloader');
const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../helpers/date');

// CREATED DATALOADER OBJECT THAT TAKES A BATCHING FUNCTION THAT CAN EXECUTE FOR ALL KINDS OF EVENTS
const eventLoader = new DataLoader((eventIds) => {
    //EXECUTE FUNCTION THAT RETURNS EVENT IDS
    return events(eventIds);
});

/* DATALOADER ALWAYS NEEDS AN ARRAY OF IDENTIFIERS BEACUSE IT WILL THEN MERGE ALL IDENTIFIERS TOGETHER MAKE A BATCH REQUEST
    THEN SPLIT THE RESULT UP
    FOR EACH EVENT WE HAVE THE CREATOR MERGE REQUEST TO ONE REQUEST USER DATABASE WHICH FETCHES USERRS FOR ALL ID 
    OF ALL USERS FOR THE EVENTS TRYING TO ACCESS
*/ 
const userLoader = new DataLoader(userIds => {
    // RETURN PROMISE USER FINDS RETURNS SUCH A PROMISE WITH ARRAY OF USERS 
    return User.find({_id: {$in: userIds}});
  });

  const user = async userId => {
    try {
      const user = await userLoader.load(userId.toString());
      return {
        ...user._doc,
        _id: user.id,
        // createdEvents: eventLoader.load.bind(this, user._doc.createdEvents)
        createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
      };
    } catch (err) {
      throw err;
    }
  };
 
// USING ASYNC AND AWAIT INSTEAD OF THEN AND CATCH 
const events = async eventIds => {
    // TAKES ARRAY OF EVENTS IDS AND RETURNS THE EVENTS IT FOUND WITH THAT ID 
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
        // const event = await Event.findById(eventId);
        const event = await eventLoader.load(eventId.toString());
        return event;
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