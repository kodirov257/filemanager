import os from 'node:os';
import process from 'node:process';

const printOS = (command) => {
    switch (command) {
        case 'EOL':
            printEOL();
            break;
        case 'cpus':
            printCPU();
            break;
        case 'homedir':
            printHomedir();
            break;
        case 'username':
            printUsername();
            break;
        case 'architecture':
            printArchitecture();
            break;
        default:
            throw new Error('Invalid argument');
    }

    process.stdout.write(os.EOL);
}

const printEOL = () => {
    process.stdout.write(os.EOL);
}

const printCPU = () => {
    const cpus = os.cpus().map(({times, ...rest}) => rest);
    console.table(cpus);
}

const printHomedir = () => {
    process.stdout.write(os.homedir());
}

const printUsername = () => {
    process.stdout.write(os.userInfo().username);
}

const printArchitecture = () => {
    process.stdout.write(os.arch());
}

const osService = {
    printOS,
};

export default osService;