const { Worker } = require('worker_threads');
const path = require('path');

const workerFilePath = path.resolve(__dirname, 'worker.ts');

const worker = new Worker(workerFilePath, {
    workerData: process.env.WORKER_DATA,
    execArgv: ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register'],
});

worker.on('message', (message) => {
    if (message.status === 'success') {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

worker.on('error', (err) => {
    console.error(err);
    process.exit(1);
});

worker.on('exit', (code) => {
    if (code !== 0) {
        console.error(new Error(`Worker stopped with exit code ${code}`));
    }
});
