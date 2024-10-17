const amqp = require("amqplib");

// Check if severity arguments are provided
const args = process.argv.slice(2);
if (args.length === 0) {
	console.error("Usage: receive_logs_direct_logs.js [info] [warning] [error]");
	process.exit(1);
}

const receiveLog = async () => {
	try {
		// Connect to RabbitMQ server
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		const exchange = "direct_logs";

		// Declare the exchange
		await channel.assertExchange(exchange, "direct", { durable: false });

		// Declare an exclusive queue
		const q = await channel.assertQueue("", { exclusive: true });

		console.log("[*] Waiting for logs. To exit press CTRL+C");

		// Bind the queue to each severity provided in args
		for (const severity of args) {
			await channel.bindQueue(q.queue, exchange, severity);
		}

		// Consume messages from the queue
		channel.consume(
			q.queue,
			(msg) => {
				if (msg) {
					console.log(
						`[x] ${msg.fields.routingKey}: '${msg.content.toString()}'`
					);
				}
			},
			{ noAck: true }
		);
	} catch (error) {
		console.error("Error occurred:", error);
		process.exit(1);
	}
};

receiveLog();
