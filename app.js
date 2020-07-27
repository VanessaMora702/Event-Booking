const express = require('express');
const bodyParser = require('body-parser'); 
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

// Imported from the express package to create an express app object which in return can start node server.
const app = express();

// body parser incoming json 
app.use(bodyParser.json());

// app.get('/', (req, res, next) => {
//     res.send("Hello world");
// })

app.use('/graphql' , 
graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            getEvents: [String!]!
        }

        type RootMutations {
            createEvent(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutations
        }
    `),
    rootValue: {
        // resolver functions that need to match schemas by name
        getEvents: () => {
            return ['Romantic Cooking', 'Sailing', 'All-Night Coding'];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
})
);

// Calling port 3000
app.listen(3000);