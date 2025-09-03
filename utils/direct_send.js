const amqp = require("amqplib");

async function sendDirect() {
    const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

    const exchange = "direct_logs";
    await channel.assertExchange(exchange, "direct", { durable: false})

    const msg = "this is an error log";
    const routingKey = "error";

    channel.publish(exchange, routingKey, Buffer.from(msg));
    console.log(`Sent '${msg}' with routing key '${routingKey}' `)

    setTimeout(() => {
connection.close()
    }, 500)
}
sendDirect();