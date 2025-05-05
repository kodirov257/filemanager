import process from 'node:process';
import fs from 'node:fs/promises';
import path from 'node:path';

const goUpperDirectory = () => {
    const currentDirectory = process.cwd();
    const newDirectory = path.dirname(currentDirectory);
    process.chdir(newDirectory);

    return newDirectory;
}

const goDedicatedDirectory = async (destination) => {
    const currentDirectory = process.cwd();
    if (!destination.startsWith('/')) {
        destination = path.join(currentDirectory, destination);
    }

    try {
        await fs.access(destination);
        process.chdir(destination);
    } catch (err) {
        throw new Error(`FS operation failed: ${destination} does not exists.`);
    }

    return destination;
};

const printAllFilesAndFolders = async () => {
    const currentDirectory = process.cwd();
    try {
        const items = await fs.readdir(currentDirectory);

        const list = await Promise.all(items.map(async (file) => {
            const fullPath = path.join(currentDirectory, file);
            const stat = await fs.stat(fullPath);

            return {
                Name: file,
                Type: stat.isDirectory() ? 'directory' : 'file',
            };
        }));

        const sortedList = list.sort((a, b) => {
            if (a.Type !== b.Type) {
                return a.Type === 'directory' ? -1 : 1;
            }

            return a.Name.localeCompare(b.Name);
        });

        console.table(sortedList);
    } catch (err) {
        throw new Error(`FS operation failed: ${err}`);
    }
};

const navigationService = {
    goUpperDirectory,
    goDedicatedDirectory,
    printAllFilesAndFolders,
};

export default navigationService;