import navigationService from './navigationService.js';
import process from 'node:process';

const args = process.argv.slice(2);
const baseWorkingPath = args[0];
let currentPath = baseWorkingPath;

const commandNames = ['list', 'up'];

const commandsDisplay = `
Available commands:
  list                                  Lists all commands$
 Navigation & working directory
  up                                    Go upper from current directory
`;
let display = `
Usage:
  command [options] [arguments]\n${commandsDisplay}\n`;

process.stdout.write(display);
let result = '';

const resolveInput = (chunk) => {
    const chunkStringified = chunk.toString().trim();
    if (chunkStringified.includes('.exit')) {
        process.exit(0);
    }
    
    const commandName = chunkStringified.split(' ')[0];
    if (!commandNames.includes(commandName)) {
        console.log(`\nInvalid input`);
    }

    result = '';
    switch (commandName) {
        case 'list':
            result = commandsDisplay;
            break;
        case 'up': 
            currentPath = navigationService.goUpperDirectory(currentPath);
            result = `Current working directory is ${currentPath}\n`;
            break;
    }

    process.stdout.write(`${result}\n`);
};

process.stdin.on('data', resolveInput);