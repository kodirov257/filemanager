import cliParserService from './services/cliParserService.js';
import helpers from './services/helpers.js';
import { spawn } from 'node:child_process';
import process from 'node:process';
import path from 'path';

const username = helpers.parseUsername(cliParserService.parseCliArguments());
process.stdout.write(`Welcome to the File Manager, ${username}!\n`);
process.stdout.write('Type one of operations. To quit type ".exit" or press Ctrl+C\n');

const run = async (args) => {
    const child = spawn('node', [path.join(import.meta.dirname, '/services/cliPromptService.js'), ...args], {
        stdio: ['pipe'],
    });
    
    process.stdin.pipe(child.stdin);
    child.stdout.pipe(process.stdout);

    process.stdin.setEncoding('utf8');

    process.on('SIGINT', () => {
        child.kill();
    });

    child.on('exit', () => {
        process.stdout.write(`Thank you for using File Manager, ${username}, goodbye!\n`);
        process.exit(0);
    });

    child.on('error', (err) => {
        if (err) {
            console.log(`Error occured: ${err}`);
        }

        process.stdin.pipe(child.stdin);
        child.stdout.pipe(process.stdout);        
    })
};

const kernel = {
    run,
};
export default kernel;