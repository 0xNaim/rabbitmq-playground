const amqp = require("amqplib");

const emitLog = async () => {
	try {
		// Connect to RabbitMQ server
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		// Declare exchange
		const exchange = "direct_logs";
		await channel.assertExchange(exchange, "direct", { durable: false });

		// Extract arguments from the command line
		const args = process.argv.slice(2);
		const msg = args.slice(1).join(" ") || "Hello World!";
		const severity = args[0] || "info";

		// Publish message with severity as routing key
		channel.publish(exchange, severity, Buffer.from(msg));
		console.log(`[x] Sent ${severity}: '${msg}'`);

		// Gracefully close the connection
		setTimeout(async () => {
			await channel.close();
			await connection.close();
		}, 500);
	} catch (error) {
		console.error("Error occurred:", error);
		process.exit(1);
	}
};

emitLog();
