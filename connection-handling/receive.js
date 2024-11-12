const amqp = require("amqplib");

async function receive() {
	try {
		// Connect to RabbitMQ server
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		const queue = "Hello";
		// Ensure the queue exists (non-durable for this example)
		await channel.assertQueue(queue, { durable: false });

		console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

		// Start consuming messages
		channel.consume(queue, (msg) => {
			if (msg !== null) {
				console.log(`[x] Received: ${msg.content.toString()}`);
			}
		}, { noAck: true });

		// Gracefully handle shutdown with signal interrupt
		process.on("SIGINT", async () => {
			console.log("\n[x] Closing connection...");
			await channel.close();
			await connection.close();
			console.log("[x] Connection closed");
			process.exit(0);
		});
	} catch (error) {
		console.error("Error in receiving messages:", error);
	}
}

receive();
