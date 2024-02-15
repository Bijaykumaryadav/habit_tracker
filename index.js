//index.js
const express = require('express');
const app = express();
const port = 8000;
//setting up mongodb
const db = require('./config/mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//extract style and scripts from subpages into the layout
app.set("layout extractStyles",true);
app.set("layout extractScripts");
//setting up templete engine
app.set('view engine','ejs');
app.set('views','./views');
//using express router in the main index.js
app.use('/',require('./routes'));
//setting express router
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on Port: ${port}`);
})
// app.listen(port,function(err){
//     if(err){
//         console.log('Error in running the server: ',err);
//     }
//     console.log('Server is running on port: ',port);
// })