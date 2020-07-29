const Event = require('../../models/event');
const { transformEvent } = require('./merge');


    // resolver functions that need to match schemas by name
    module.exports = {
        getEvents: () => {
        // return events;
       return Event.find()
       .then(events => {
        // mongoose returns metadata
            return events.map(event => {
                return transformEvent(event)
            })
        }).catch(error => {
            throw error;
        })
    },
    // Create Event
    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: '5f20bd245f53f203d81d92ff'
        });
        let createdEvent
        return event.save().then(result => {
            createdEvent = transformEvent(result)
            return User.findById('5f20bd245f53f203d81d92ff')
        }).then(user => {
            if (!user) {
                throw new Error("User not found.")
            }
            user.createdEvents.push(event);
            return user.save();
        }).then(result => {
            return createdEvent;
        })
        .catch(err => {
            throw err;
        });
    },
}