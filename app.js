const express = require('express');
const bodyParser = require('body-parser'); 
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const { assertValidExecutionArguments } = require('graphql/execution/execute');

// Imported from the express package to create an express app object which in return can start node server.
const app = express();

const events = [];

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
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
             events.push(event);
             return event;
        }
    },
    graphiql: true
})
);

// Calling port 3000
app.listen(3000);