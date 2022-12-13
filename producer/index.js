const experess = require("express");
const mongoose = require("mongoose");
const sequelize = require("sequelize");

const amqp = require("amqplib");
const { Sequelize } = require("sequelize");

const app = experess();


const PORT = process.env.PORT || 4003;
function  startUp () {
    /*const sequelize = new Sequelize(process.env.PG_URL, sequelize.authenticate()
    .then(conn=>{
        console.log('Consumer: Connected to Postgres');
    }).catch(() => {
        console.error("Caught an error");
      })*/
}
var channel, conn;

async function sendToQueue(data){
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        console.log('Start publishing');
        return await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
        console.log('End publishing');

        await channel.close();
        await connection.close();
    }
    catch (ex) {
        console.error(ex);
    }
}

app.get("/send-msg", (req, res) => {
    
    // data to be sent
    const data = {
        productId  : 1,
        Name : "IPhone",
        Price: 200,
        Model:2022
    }
    //connectQueue();
    sendToQueue(data);  // pass the data to the function we defined
    console.log("A message is sent to queue")
    res.send("Message Sent"); //response to the API request
    
})
app.listen(PORT, ()=>console.log("Server running at port: "+ PORT));
