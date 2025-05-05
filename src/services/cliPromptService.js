import navigationService from './navigationService.js';
import fileStreamService from './fileStreamService.js';
import process from 'node:process';

const args = process.argv.slice(2);
const baseWorkingPath = args[0];
let currentPath = baseWorkingPath;
process.chdir(currentPath);

const commandNames = ['list', 'up', 'cd', 'ls', 'cat', 'mkdir'];

const commandsDisplay = `
Available commands:
  list                                  Lists all commands$
 Navigation & working directory
  up                                    Go upper from current directory
  cd [path_to_directory]                Go to dedicated folder from current directory
  ls                                    Print in console list of all files and folders in current directory
 Basic operations with files
  cat [path_to_file]                    Read file and print it's content in console
  mkdir [new_directory_name]            Create new directory in current working directory
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
                currentPath = navigationService.goUpperDirectory();
                result = `Current working directory is ${currentPath}\n`;
                break;
            case 'cd':
                if (!args[1]) {
                    result = 'Please provide path to directory';
                    break;
                }
                currentPath = await navigationService.goDedicatedDirectory(args[1]);
                result = `Current working directory is ${currentPath}\n`;
                break;
            case 'ls':
                await navigationService.printAllFilesAndFolders();
                break;
            case 'cat':
                if (!args[1]) {
                    result = 'Please provide path to file';
                    break;
                }
                result = await fileStreamService.readFileContent(args[1]);
                break;
            case 'mkdir':
                if (!args[1]) {
                    result = 'Please provide name of directory';
                    break;
                }

                const folderPath = await fileStreamService.makeDirectory(args[1]);
                result = `Directory ${folderPath} created successfully.`;
                break;
        }
    } catch (err) {
        result = err.message;
    }

    process.stdout.write(`${result}\n\n`);
};

process.stdin.on('data', resolveInput);