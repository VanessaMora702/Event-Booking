const express = require('express');
const bodyParser = require('body-parser'); 
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const { assertValidExecutionArguments } = require('graphql/execution/execute');
const mongoose = require('mongoose')
const Event = require('./models/event');

// Imported from the express package to create an express app object which in return can start node server.
const app = express();

// const events = [];

// body parser incoming json 
app.use(bodyParser.json());

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
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            getEvents: [Event!]!
        }

        type RootMutations {
            createEvent(eventInput: EventInput): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutations
        }
    `),
    rootValue: {
        // resolver functions that need to match schemas by name
        getEvents: () => {
            return events;
        },
        createEvent: (args) => {
            // BEFORE DATABASE 
            // const event = {
            //     _id: Math.random().toString(),
            //     title: args.eventInput.title,
            //     description: args.eventInput.description,
            //     price: +args.eventInput.price,
            //     date: args.eventInput.date
            // };
            // AFTER DATABASE
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event.save().then(result => {
                console.log(result);
                return {...result._doc}
            }).catch(err => {
                console.log(err);
                throw err;
            });
            // return event;
            //  events.push(event);
        }
    },
    graphiql: true
})
);
// Conecting database 
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}
@cluster0.nmugw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(()=> {
    // if promise success start server 
    app.listen(3000)
}).catch(err => {
    // else log error
    console.log(err)
});

// Calling port 3000
app.listen(3000);