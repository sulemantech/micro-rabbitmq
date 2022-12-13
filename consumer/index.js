const amqp = require("amqplib");
async function connect() {
 try {
   const connection = await amqp.connect("amqp://localhost:5672");
   const channel = await connection.createChannel();
   await channel.assertQueue("test-queue");
   channel.consume("test-queue", message => {
     const input = JSON.parse(message.content.toString());
     console.log(`Received number: ${message.content.toString()}`);
     channel.ack(message);
   });
   console.log(`Waiting for messages...`);
 } catch (ex) {
   console.error(ex);
 }
}
connect();