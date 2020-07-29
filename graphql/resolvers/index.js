
const bcrypt = require('bcryptjs')
const Event = require('../models/event');
const User = require('../models/user');

module.exports =  {
    // resolver functions that need to match schemas by name
    getEvents: () => {
        // return events;
       return Event.find()
       .then(events => {
        // mongoose returns metadata
            return events.map(event => {
                return { ...event._doc, 
                    _id: event._doc._id.toString(),
                    creator: user.bind(this, event._doc.creator)
                };
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
            date: new Date(args.eventInput.date),
            creator: '5f20bd245f53f203d81d92ff'
        });
        let createdEvent
        return event.save().then(result => {
            createdEvent = { ...result._doc, _id: event.id, creator: user.bind(this, result_doc.creator)}
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
            console.log(err);
            throw err;
        });
    },
    // Create User
    createUser: (args) => {
        return User.findOne({email: args.userInput.email}).then(user => {
            if (user) {
                throw new Error("User already exists.")
            }
            // hash password : number security of the hash 12 rounds of salting
            return bcrypt.hash(args.userInput.password, 12);
        }).then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
            });
            return user.save();
        }).then(result => {
                return {...result._doc, password: null,  _id: result.id};
        })
        .catch(error => {
            throw error;
        })
    }
}