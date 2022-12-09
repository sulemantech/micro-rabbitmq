const experess = require("express");
const { Sequelize } = require("sequelize");
const sequalize = require("sequelize");
const app = experess();

const startUp = async ()=>{

    const sequalize = new Sequelize(process.env.PG_URI);
    sequalize.authenticate().then(conn=>{
        console.log("Consumer connected to Postgres");
    })
    
    const queue = 'tasks';
    const conn = await amqplib.connect('amqp://localhost');

    const ch1 = await conn.createChannel();
    await ch1.assertQueue(queue);

    // Listener
    ch1.consume(queue, (msg) => {
        if (msg !== null) {
        console.log('Received:', msg.content.toString());
        ch1.ack(msg);
        } else {
        console.log('Consumer cancelled by server');
        }
    });

    // Sender
    const ch2 = await conn.createChannel();

    setInterval(() => {
        ch2.sendToQueue(queue, Buffer.from('something to do'));
    }, 1000);
}
setTimeout(startUp,30000);

app.get("/",()=>{
    res.json({
        message:"Aoa World";
    })
});

app.listen(process.env.EXPRESS_PORT);
