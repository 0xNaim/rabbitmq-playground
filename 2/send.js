const amqp = require("amqplib");

async function send() {
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

		// Close the channel first, then the connection
		await channel.close();
		await connection.close();

		// Graceful completion
		console.log("[x] Connection closed");
	} catch (error) {
		console.error("Error occurred:", error);
	}
}

send();
