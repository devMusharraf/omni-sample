const amqp = require("amqplib");

async function sendMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "hello";
  await channel.assertQueue(queue);

  const msg = "Hello RabbitMQ!";
  channel.sendToQueue(queue, Buffer.from(msg));

  console.log("Message sent:", msg);
  await connection.close();
}

sendMessage();
