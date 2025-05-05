import { pipeline } from 'node:stream';
import zlib from 'node:zlib';
import fs from 'node:fs';
import process from "node:process";
import path from "node:path";

const compress = async (sourcePath, destinationPath) => {
    if (!sourcePath.startsWith('/')) {
        const currentPath = process.cwd();
        sourcePath = path.join(currentPath, sourcePath);
    }

    if (!destinationPath.startsWith('/')) {
        destinationPath = path.join(process.cwd(), destinationPath);
    }

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
};

const decompress = async (sourcePath, destinationPath) => {
    if (!sourcePath.startsWith('/')) {
        const currentPath = process.cwd();
        sourcePath = path.join(currentPath, sourcePath);
    }

    if (!destinationPath.startsWith('/')) {
        destinationPath = path.join(process.cwd(), destinationPath);
    }

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
};

const compressorService = {
    compress,
    decompress,
};

export default compressorService;