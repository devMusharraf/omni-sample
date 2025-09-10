// utils/rabbitmq.js
const amqp = require("amqplib");

let channel; // keep channel in module scope

async function connectRabbitMQ() {
  if (channel) return channel; // reuse channel if exists

  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  return channel;
}

async function sendToQueue(queue, message) {
  const ch = await connectRabbitMQ();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  return message;
}

async function consumeQueue(queue, callback) {
  const ch = await connectRabbitMQ();
  await ch.assertQueue(queue, { durable: true });
  ch.consume(queue, async (msg) => {
    if (msg !== null) {
      // ✅ fixed condition
      try {
        const data = JSON.parse(msg.content.toString());
        await callback(data);
        ch.ack(msg);
      } catch (err) {
        console.error("Error processing message:", err);
        ch.nack(msg, false, true); // requeue on failure
      }
    }
  });
}

module.exports = { sendToQueue, consumeQueue };
