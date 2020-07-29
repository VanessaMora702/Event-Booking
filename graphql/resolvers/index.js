
const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const booking = require('../../models/booking');

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id, 
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
    }
}

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
    const events = await Event.find({_id: {$in: eventIds}})
    return events.map(event => {
            return transformEvent(event)
        });
     } catch (error) {
         throw error;
     }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event)

    } catch (err) {
        throw err;
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



module.exports =  {
    // resolver functions that need to match schemas by name
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

    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {...booking._doc, 
                    _id: booking.id, 
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                }
            })
        } catch (err){
            throw err;
        }
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
    },
    // Create Booking
    createBooking: async args => {
        try {
            const fetchedEvent = await Event.findOne({_id: args.eventId})
            const booking = await new Booking({
                user: '5f20bd245f53f203d81d92ff',
                event: fetchedEvent
            })
            const result = await booking.save();
            return {
                ...result._doc, 
                _id: result.id,
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            };
        } catch (error) {
            throw error;
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event)
            await Booking.deleteOne({_id: args.bookingId}) 
            return event;
        } catch (err) {
            throw err;
        }
    }
}