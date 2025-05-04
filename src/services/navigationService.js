import path from 'node:path';

const goUpperDirectory = (currentDirectory) => path.dirname(currentDirectory);

const navigationService = {
    goUpperDirectory,
};

export default navigationService;