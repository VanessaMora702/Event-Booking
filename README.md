# Event-Booking
GraphQL w/ MERN (MangoDB, Express, React and Node)

Install NPM 

    STEPS TO CREATED BASIC NODE EXPRRESS SERVER 
        1) run on terminal npm init 
        2) npm install --save express body-parser
        3) run npm install --save-dev nodemon
        4) added to package.json "start": "nodemon app.js"

    STEPS GRAPHQL API IMPLEMENTATION
        install extra packages to make GraphQL run
        1) npm install --save express-graphql 
            descripiton of package: graphql package that can be used as a middleware in express nodejs applications
                                    and that allows us to point at a schema at resolvers and automatically connect
                                    all of it for us and route request to a parser and then handle them according to the schema
                                    and forward them to the right resolvers.
        2) npm install --save graphql
            description of package: allow us to define the schema and setup the schema that follows the official 
                                    graphql specifications and definitions and that will return a valid schema.
                                    Its going to parse the schema and convert it which then can be used to gather with expres
                                    graphql.
    STEPS TO INSTALL MONGODB DATABASE TO APP
        1) Created a new mongoDB Cluster, Database User and also added Local IP address
        2) npm install --save mongoose
            description of package: Installed Mongoose third party libary that builds on mongoDB driver and adds convinence      
                                    features that allows you to work with models that allows you to mange data through Javascript objects
    STEPS TO HASH PASSWORDS 
        1) npm install --save bcryptjs
            description of package: gives cryptographic methods that helps create a hash which you can later
                                    compare into an incoming password to see if incoming password is corrrect but
                                    prevents you to get the original password.
    STEPS TO CREATE A JASON WEB TOKEN
        1) npm install --save jsonwebtoken
            description of package: helps generate json web token which verifies if the users login information is
                                    correct.
    STEPS TO CREATING REACT APP
         1) npx create-react-app
         2) npm install --save react-rounter-dom
            description of package: helps route files maintaing single page application, react router will watch for   
                                    changes in the url and render different components to the screen.
    STEPS TO REDUCE AMOUNT OF REQUESTS CALLED WHICH SPEEDS UP API AND PREVENTS DUPLICATE REQUESTS 
        1) npm install --save dataloader
            description of package: is a generic utility to be used as part of your application's data fetching layer to provide a simplified and consistent API over various remote data sources such as databases or web services via batching and caching.
     STEPS TO INSTALL REACT CHART.JS
        1) npm install --save react-chartjs
            description of package: supports Line Charts, Bar Chart, Radar Chart, Polar are Chart, Pie Chart, Doughnut Chart works with any framework.
        2) npm install --save chart.js
            description of package: you need both packages installed if you run the first package without 2nd it will give you an error
                                     Error Can't resolve 'chart.js' in node_modules path.

    WHAT IS GRAPHQL:
        GraphQL is basicly a specification that defines query language which clients can send in 
        the body of a post request to the backend. So the job of the backend will be to parse these incoming queries
        to understand these commands sent by the frontend and deliver the right data back to the frontend or do whatever query 
        instructs you to do there are also mutations which allows the server to save, delete or update something.

    NOTES: 
        How to uninstall an npm Node package, locally or globally
        npm uninstall <package-name> from the project root folder (the folder that contains the node_modules folder). ...
        npm uninstall -S <package-name> npm uninstall -D <package-name> ...
        npm uninstall -g <package-name>
        
    START PROJECT 
        run npm start for backend
        navigate to frontend folder event-booking and run npm start to start frontend

     <!-- THERE IS LOTS OF ROOM FOR IMPROVMENT:
            1) Add Persistent Authentication so you dont have to login everytime page refreshes
            Store Token locally storage add expiry time or add refresh token
            2) With dataloader you can set up catching per request user interface instead of the catching it has per server lifetime not optimal
            3) Add toast notification for user's 
            4) Mobile responsive
            5) Utilize third party library like Apollo : Huge libary that can help create both graphQL servers backend as well as use it on the frontend
                for efficient request and catching of API responses on the frontend.
            -->

