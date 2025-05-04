import process from 'node:process';

const args = process.argv.slice(2);
const baseWorkingPath = args[0];

const resolveInput = (chunk) => {
    const chunkStringified = chunk.toString().trim();
    if (chunkStringified.includes('.exit')) {
        process.exit(0);
    }

    process.stdout.write(`${chunk}\n`)
};

process.stdin.on('data', resolveInput);