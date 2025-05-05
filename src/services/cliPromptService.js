import navigationService from './navigationService.js';
import process from 'node:process';

const args = process.argv.slice(2);
const baseWorkingPath = args[0];
let currentPath = baseWorkingPath;

const commandNames = ['list', 'up', 'cd', 'ls'];

const commandsDisplay = `
Available commands:
  list                                  Lists all commands$
 Navigation & working directory
  up                                    Go upper from current directory
  cd [path_to_directory]                Go to dedicated folder from current directory
  ls                                    Print in console list of all files and folders in current directory
`;
let display = `
Usage:
  command [options] [arguments]\n${commandsDisplay}\n`;

process.stdout.write(display);
let result = '';

const resolveInput = async (chunk) => {
    const chunkStringified = chunk.toString().trim();
    if (chunkStringified.includes('.exit')) {
        process.exit(0);
    }

    const args = chunkStringified.split(' ');
    const commandName = args[0];
    if (!commandNames.includes(commandName)) {
        console.log(`\nInvalid input`);
    }

    result = '';

    try {
        switch (commandName) {
            case 'list':
                result = commandsDisplay;
                break;
            case 'up':
                currentPath = navigationService.goUpperDirectory(currentPath);
                result = `Current working directory is ${currentPath}\n`;
                break;
            case 'cd':
                const destination = args[1];
                if (!destination) {
                    result = 'Please provide path to directory';
                    break;
                }
                currentPath = await navigationService.goDedicatedDirectory(currentPath, destination);
                result = `Current working directory is ${currentPath}\n`;
                break;
            case 'ls':
                await navigationService.printAllFilesAndFolders(currentPath);
                break;
        }
    } catch (err) {
        result = err.message;
    }

    process.stdout.write(`${result}\n`);
};

process.stdin.on('data', resolveInput);