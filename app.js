const express = require('express');
const bodyParser = require('body-parser'); 
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const { assertValidExecutionArguments } = require('graphql/execution/execute');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const Event = require('./models/event');
const User = require('./models/user');


// Imported from the express package to create an express app object which in return can start node server.
const app = express();

// const events = [];

// body parser incoming json 
app.use(bodyParser.json());

const user = userId => {
    return User.findById(userId).then(user => {
        return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createEvents)}
     }).catch(error => {
        throw err
    })
}

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}}).then(events => {
        return events.map(event => {
            return {...event._doc,
                 _id: event.id, 
                 creator: user.bind(this, event.creator)}
        })
     }).catch(error => {
        throw error;
    })
}


// app.get('/', (req, res, next) => {
//     res.send("Hello world");
// })

app.use('/graphql' , 
graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            getEvents: [Event!]!
        }

        type RootMutations {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutations
        }
    `),
    rootValue: {
        // resolver functions that need to match schemas by name
        getEvents: () => {
            // return events;
           return Event.find()
           .then(events => {
            // mongoose returns metadata
                return events.map(event => {
                    return { ...events._doc, 
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
                createdEvent = { ...result._doc, _id: event.id}
                return User.findById('5f20bd245f53f203d81d92ff')
                return { ...result._doc, _id: event.id}
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
    },
    graphiql: true
})
);
// Conecting database 
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.nmugw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(res => {
    // if promise success start server 
    app.listen(5000)
}).catch(err => {
    // else log error
    console.log("Database connection error", err)
});

// Calling port 3000
app.listen(3000);