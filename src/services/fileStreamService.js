import process from 'node:process';
import fs from 'node:fs/promises';
import fs_stream from 'node:fs';
import path from 'node:path';

const readFileContent = async (sourcePath) => {
    const currentPath = process.cwd();
    if (!sourcePath.startsWith('/')) {
        sourcePath = path.join(currentPath, sourcePath);
        try {
            await fs.access(sourcePath);

            const stream = fs_stream.createReadStream(sourcePath, {encoding: 'utf-8'});

            stream.on('data', (chunk) => {
                process.stdout.write(`${chunk}\n`);
            });
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

const renameFile = async (oldName, newName) => {
    if (!oldName.startsWith('/')) {
        oldName = path.join(process.cwd(), oldName);
    }
    newName = path.join(process.cwd(), newName);

    try {
        await fs.access(oldName);

        await fs.rename(oldName, newName);
    } catch (err) {
        throw new Error(`FS operation failed: ${oldName} does not exists.`);
    }
}

const copyFile = async (filePath, newFilePath) => {
    if (!filePath.startsWith('/')) {
        filePath = path.join(process.cwd(), filePath);
    }
    if (!newFilePath.startsWith('/')) {
        newFilePath = path.join(process.cwd(), newFilePath);
    }

    try {
        await fs.access(filePath);
        await fs.access(newFilePath);

        newFilePath = path.join(newFilePath, path.basename(filePath));

        await fs.cp(filePath, newFilePath, {errorOnExist: true, force: false});

        return newFilePath;
    } catch (err) {
        throw new Error(`FS operation failed: ${filePath} or ${newFilePath} does not exists.`);
    }
}

const moveFile = async (filePath, newFilePath) => {
    if (!filePath.startsWith('/')) {
        filePath = path.join(process.cwd(), filePath);
    }
    if (!newFilePath.startsWith('/')) {
        newFilePath = path.join(process.cwd(), newFilePath);
    }

    try {
        await fs.access(filePath);
        await fs.access(newFilePath);

        newFilePath = path.join(newFilePath, path.basename(filePath));

        const readStream = fs_stream.createReadStream(filePath, {encoding: 'utf-8'});
        const writeStream = fs_stream.createWriteStream(newFilePath, {encoding: 'utf-8'});

        readStream.pipe(writeStream);

        await fs.rm(filePath);

        return newFilePath;
    } catch (err) {
        throw new Error(`FS operation failed: ${filePath} or ${newFilePath} does not exists.`);
    }
}

const deleteFile = async (filePath) => {
    if (!filePath.startsWith('/')) {
        filePath = path.join(process.cwd(), filePath);

        try {
            await fs.access(filePath);
            await fs.rm(filePath);
        } catch (err) {
            throw new Error(`FS operation failed: ${filePath} does not exists.`);
        }
    }
};

const fileStreamService = {
    readFileContent,
    makeDirectory,
    renameFile,
    copyFile,
    moveFile,
    deleteFile
};
export default fileStreamService;