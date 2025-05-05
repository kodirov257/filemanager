import process from 'node:process';
import fs from 'node:fs/promises';
import path from 'node:path';

const readFileContent = async (sourcePath) => {
    const currentPath = process.cwd();
    if (!sourcePath.startsWith('/')) {
        sourcePath = path.join(currentPath, sourcePath);
        try {
            await fs.access(sourcePath);

            return await fs.readFile(sourcePath, {encoding: 'utf-8'});
        } catch (err) {
            throw new Error(`FS operation failed: ${sourcePath} does not exists.`);
        }
    }
};

const makeDirectory = async (name) => {
    const sourcePath = path.join(process.cwd(), name);

    try {
        await fs.mkdir(sourcePath);

        return sourcePath;
    } catch (err) {
        throw new Error(`FS operation failed: ${sourcePath} does not exists.`);
    }
};

const fileStreamService = {
    readFileContent,
    makeDirectory,
};
export default fileStreamService;