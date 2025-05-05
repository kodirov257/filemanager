import fs from 'node:fs/promises';
import path from 'node:path';

const readFileContent = async (sourcePath, currentPath) => {
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

const fileStreamService = {
    readFileContent,
};
export default fileStreamService;