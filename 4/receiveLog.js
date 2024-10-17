const amqp = require("amqplib");

const receiveLog = async () => {
	try {
		// Connect to RabbitMQ server
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		const exchange = "logs";

		// Assert the exchange with 'fanout' type (broadcasting)
		await channel.assertExchange(exchange, "fanout", { durable: false });

		// Create an exclusive, temporary queue for this consumer
		const q = await channel.assertQueue("", { exclusive: true });

		console.log("[*] Waiting for logs. To exit press CTRL+C");

		// Bind the queue to the exchange
		await channel.bindQueue(q.queue, exchange, "");

		// Consume messages from the queue
		channel.consume(
			q.queue,
			(msg) => {
				if (msg.content) {
					console.log("[x] Received: %s", msg.content.toString());
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
