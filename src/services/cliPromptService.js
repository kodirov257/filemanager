import navigationService from './navigationService.js';
import fileStreamService from './fileStreamService.js';
import process from 'node:process';

const args = process.argv.slice(2);
const baseWorkingPath = args[0];
let currentPath = baseWorkingPath;
process.chdir(currentPath);

const commandNames = ['list', 'up', 'cd', 'ls', 'cat', 'mkdir', 'rn', 'cp', 'mv', 'rm'];

const commandsDisplay = `
Available commands:
  list                                      Lists all commands$
 Navigation & working directory
  up                                        Go upper from current directory
  cd [path_to_directory]                    Go to dedicated folder from current directory
  ls                                        Print in console list of all files and folders in current directory
 Basic operations with files
  cat [path_to_file]                        Read file and print it's content in console
  mkdir [new_directory_name]                Create new directory in current working directory
  rn [path_to_file] [new_filename]          Rename file
  cp path_to_file path_to_new_directory     Copy file
  mv path_to_file path_to_new_directory     Move file
  rm path_to_file                           Delete file
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
            case 'rn':
                if (!args[1] || !args[2]) {
                    result = 'Please provide path to file and new filename';
                    break;
                }

                await fileStreamService.renameFile(args[1], args[2]);

                result = `File ${args[1]} renamed successfully to ${args[2]}.`;
                break;
            case 'cp':
                if (!args[1] || !args[2]) {
                    result = 'Please provide path to file and path to new file';
                    break;
                }

                const copiedFilePath = await fileStreamService.copyFile(args[1], args[2]);

                result = `File ${args[1]} copied successfully to ${copiedFilePath}.`;

                break;
            case 'mv':
                if (!args[1] || !args[2]) {
                    result = 'Please provide path to file and path to new file';
                    break;
                }

                const movedFilePath = await fileStreamService.moveFile(args[1], args[2]);

                result = `File ${args[1]} moved successfully to ${movedFilePath}.`;

                break;
            case 'rm':
                if (!args[1]) {
                    result = 'Please provide name of directory';
                    break;
                }

                await fileStreamService.deleteFile(args[1]);
                result = `Directory ${args[1]} deleted successfully.`;
                break;
        }
    } catch (err) {
        result = err.message;
    }

    process.stdout.write(`${result}\n\n`);
};

process.stdin.on('data', resolveInput);