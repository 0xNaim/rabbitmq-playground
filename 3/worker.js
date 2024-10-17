const amqp = require("amqplib");

async function worker() {
	try {
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		const queue = "new_task_queue_2";
		await channel.assertQueue(queue, { durable: false });
		channel.prefetch(1); // Process one message at a time

		console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);

		channel.consume(
			queue,
			(msg) => {
				if (msg !== null) {
					const secs = msg.content.toString().split(".").length - 1;
					console.log("[x] Received %s", msg.content.toString());

					const exit = process.argv.slice(2).join(" ");
					console.log("Exit: ", exit);

					if (exit === "exit") {
						console.log("Exiting...");
						process.exit(0);
					}

					// Simulate processing time based on the message content
					setTimeout(() => {
						console.log("[x] Done processing");
						channel.ack(msg); // Acknowledge the message after processing
					}, secs * 1000);
				}
			},
			{ noAck: false }
		);

		// Gracefully handle shutdown on interrupt signal
		process.on("SIGINT", async () => {
			console.log("\n[x] Shutting down...");
			await channel.close();
			await connection.close();
			console.log("[x] Connection closed");
			process.exit(0);
		});
	} catch (error) {
		console.error("Error in worker:", error);
		process.exit(1);
	}
}

worker();

// Handle "exit" argument for controlled exit
// const exit = process.argv.slice(2).includes("exit");
// if (exit) {
// 	console.log("Exit argument detected. Exiting...");
// 	process.exit(0);
// } else {
// 	worker();
// }
