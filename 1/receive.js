const amqp = require("amqplib");

async function receiveMessage() {
	try {
		// Connect to RabbitMQ server
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		const queue = "Hello";

		// Ensure the queue exists (non-durable for this example)
		await channel.assertQueue(queue, { durable: false });

		console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

		// Start consuming messages from the queue
		await channel.consume(
			queue,
			(msg) => {
				console.log(`[x] Received ${msg.content.toString()}`);
			},
			{ noAck: true } // Automatically acknowledge the message
		);
	} catch (error) {
		console.error("Error occurred:", error);
		process.exit(1);
	}
}

receiveMessage();
