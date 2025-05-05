import path from 'node:path';
import fs from 'node:fs/promises';

const goUpperDirectory = (currentDirectory) => path.dirname(currentDirectory);

const goDedicatedDirectory = async (currentDirectory, destination) => {
    if (!destination.startsWith('/')) {
        destination = path.join(currentDirectory, destination);
    }

    try {
        await fs.access(destination);
    } catch (err) {
        throw new Error(`FS operation failed: ${destination} does not exists.`);
    }

    return destination;
};

const navigationService = {
    goUpperDirectory,
    goDedicatedDirectory,
};

export default navigationService;