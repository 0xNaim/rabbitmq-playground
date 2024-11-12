const amqp = require("amqplib");

async function send() {
	try {
		// Connect to RabbitMQ server
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		const queue = "new_task_queue_2";
		const msg = process.argv.slice(2).join(" ") || "Hello World!";

		// Ensure the queue exists and is durable
		await channel.assertQueue(queue, { durable: false });

		// Send message with persistent option
		channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
		console.log(`[x] Sent '%s'`, msg);

		// Close the connection only after ensuring the message is sent
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

send();
