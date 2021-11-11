const express= require('express');
const app =express();
var cors = require('cors');
app.use(cors());
const port = 3000;
const env =require('dotenv');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require('./routes/user');
const data = require("../test.json");
env.config();


app.get("/",(req,res)=>{
  res.header("Content-Type","application/json");
  res.send(JSON.stringify(data));
})

mongoose
  .connect(
    `mongodb+srv://dani:dani@cluster0.vmisn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    `,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  ).then(() => {
    console.log("Database connected");
  });

  app.use(bodyParser.json());

  app.use("/api",userRoutes);

 

app.listen(port, (err) => {
    // err handling
    console.log('server started on port: '+port);
});