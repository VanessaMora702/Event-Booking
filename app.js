const express = require('express');
const bodyParser = require('body-parser'); 
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./graphql/middleware/is-auth');


// Imported from the express package to create an express app object which in return can start node server.
const app = express();

// const events = [];

// body parser incoming json 
app.use(bodyParser.json());



// app.get('/', (req, res, next) => {
//     res.send("Hello world");
// })
app.use(isAuth);

app.use('/graphql' , 
graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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