import cliParserService from "./services/cliParserService.js";
import helpers from "./services/helpers.js";
import { spawn } from 'node:child_process';
import path from 'path';

const __dirname = import.meta.dirname;

const username = helpers.parseUsername(cliParserService.parseCliArguments());
process.stdout.write(`Welcome to the File Manager, ${username}!\n`);

const kernel = async (args) => {
    const child = spawn('node', [path.join(__dirname, '/services/cliPromptService.js'), ...args], {
        stdio: ['pipe'],
    });
    
    process.stdin.pipe(child.stdin);
    child.stdout.pipe(process.stdout);

    process.stdin.setEncoding('utf8');
    process.stdout.write('Type ".exit" or press Ctrl+C to quit\n');

    process.on('SIGINT', () => {
        child.kill();
    });

    child.on('exit', () => {
        process.stdout.write(`Thank you for using File Manager, ${username}, goodbye!\n`);
        process.exit(0);
    });

};

kernel([__dirname]);