const { Queue, Worker } = require("bullmq");

const delay = duration =>
  new Promise(resolve => {
    setTimeout(() => resolve(), duration);
  });

const run = async () => {
  const key = `test-queue-1`;

  // Construct a queue
  const queue = new Queue(key);
  await queue.waitUntilReady();

  // Construct a worker for this queue
  const worker = new Worker(key, async () => {
    console.log("3) starting job");

    // Wait a few seconds to simulate actual work
    console.log("4) waiting for a few seconds");
    delay(2e3);

    console.log("5) completed job");
  });

  await worker.waitUntilReady();

  // Add an event handler so we know when job has finished
  const done = new Promise(resolve => {
    worker.on("completed", () => resolve());
  });

  console.log("1) adding job to queue");
  await queue.add("test-job");

  console.log("2) waiting for job to complete");
  await done;

  console.log("6) waiting for worker to close (without force)");
  await worker.close();

  console.log("7) waiting for queue to close");
  await queue.close();

  console.log("8) goodbye");
};

run().then(() => {
  console.log("9) all done but `node` process never exits");
});
