import { pipeline } from 'node:stream/promises';
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import crypto from "crypto";

const calculateHash = async (sourcePath) => {
    if (!sourcePath.startsWith('/')) {
        const currentPath = process.cwd();
        sourcePath = path.join(currentPath, sourcePath);
    }
    try {
        return await pipeline(
            fs.createReadStream(sourcePath),
            crypto.createHash('sha256').setEncoding('hex'),
            async (hash) => {
                const hashes = await hash.toArray();
                return hashes[0];
            }
        );
    } catch (err) {
        throw new Error(`FS operation failed: ${sourcePath} does not exists.`);
    }
}

const hashService = {
    calculateHash,
};

export default hashService;