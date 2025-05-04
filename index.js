import kernel from './src/kernel.js';
import os from 'node:os';

const __dirname = os.homedir();
kernel.run([__dirname]);