const amqp = require("amqplib");


async function receiveDirect(severity) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel()

    const exchange = "direct_logs";
    await channel.assertExchange(exchange, "direct", {durable: false});

    const q = await channel.assertQueue("", { exclusive: true });
    channel.bindQueue(q.queue, exchange, severity);

    console.log(`Waiting for ${severity} logs...`);
    channel.consume(q.queue, (msg) => {
       console.log(`[${severity}] Received:`, msg.content.toString());
    }, { noAck: true})
}
receiveDirect(process.argv[2]);