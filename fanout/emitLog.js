const amqp = require("amqplib");

const emitLog = async () => {
	try {
		// Connect to RabbitMQ server
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		const exchange = "logs";
		const msg = process.argv.slice(2).join(" ") || "Hello World!";

		// Assert exchange with type 'fanout' (broadcasting to all queues)
		await channel.assertExchange(exchange, "fanout", { durable: false });

		// Publish the message to the exchange
		channel.publish(exchange, "", Buffer.from(msg));
		console.log(`[x] Sent: ${msg}`);

		// Close the connection gracefully
		setTimeout(async () => {
			await channel.close();
			await connection.close();
			process.exit(0);
		}, 500);
	} catch (error) {
		console.error("Error occurred:", error);
		process.exit(1);
	}
};

emitLog();
