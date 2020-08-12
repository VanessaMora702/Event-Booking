const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./merge');


    // resolver functions that need to match schemas by name
    module.exports = {
    events: () => {
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
    createEvent: (args, req) => {
        if (!req.isAuth) {
            throw new Error("User is unauthenticated!");
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent
        return event.save().then(result => {
            createdEvent = transformEvent(result)
            return User.findById(req.userId)
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