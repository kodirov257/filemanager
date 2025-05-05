import { pipeline } from 'node:stream';
import process from 'node:process';
import zlib from 'node:zlib';
import path from 'node:path';
import fs from 'node:fs';

const compress = async (sourcePath, destinationPath) => {
    if (!sourcePath.startsWith('/')) {
        const currentPath = process.cwd();
        sourcePath = path.join(currentPath, sourcePath);
    }

    if (!destinationPath.startsWith('/')) {
        destinationPath = path.join(process.cwd(), destinationPath);
    }

    try {
        fs.accessSync(sourcePath);

        await pipeline(
            fs.createReadStream(sourcePath),
            zlib.createBrotliCompress({
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                }
            }),
            fs.createWriteStream(destinationPath),
            (err) => {
                if (err) {
                    console.error('Could not zip: ' + err);
                }
            }
        );
    } catch (err) {
        throw new Error(`FS operation failed: ${sourcePath} does not exists.`);
    }
};

const decompress = async (sourcePath, destinationPath) => {
    if (!sourcePath.startsWith('/')) {
        const currentPath = process.cwd();
        sourcePath = path.join(currentPath, sourcePath);
    }

    if (!destinationPath.startsWith('/')) {
        destinationPath = path.join(process.cwd(), destinationPath);
    }

    try {
        fs.accessSync(sourcePath);

        await pipeline(
            fs.createReadStream(sourcePath),
            zlib.createBrotliDecompress(),
            fs.createWriteStream(destinationPath),
            (err) => {
                if (err) {
                    console.error('Could not unzip: ' + err.message);
                }
            }
        );
    } catch (err) {
        throw new Error(`FS operation failed: ${sourcePath} does not exists.`);
    }
};

const compressorService = {
    compress,
    decompress,
};

export default compressorService;