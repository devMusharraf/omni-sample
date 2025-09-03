const amqp = require("amqplib");

async function receiveMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "hello";
  await channel.assertQueue(queue);

  console.log("Waiting for messages...");

  channel.consume(queue, (message) => {
    console.log("Received:", message.content.toString());
  }, { noAck: true });
}

receiveMessage();
