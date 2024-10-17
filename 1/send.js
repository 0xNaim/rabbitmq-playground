const amqp = require("amqplib");

async function sendMessage() {
	try {
		// Connect to RabbitMQ server
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		const queue = "Hello";
		const msg = "Hello World!";

		// Ensure the queue exists (non-durable for this example)
		await channel.assertQueue(queue, { durable: false });

		// Send the message to the queue
		channel.sendToQueue(queue, Buffer.from(msg));

		console.log(`[x] Sent '${msg}'`);

		// Close connection after a short delay to ensure message is sent
		setTimeout(async () => {
			await channel.close();
			await connection.close();
			process.exit(0);
		}, 500);
	} catch (error) {
		console.error("Error occurred:", error);
		process.exit(1);
	}
}

sendMessage();
