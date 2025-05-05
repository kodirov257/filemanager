import kernel from './src/kernel.js';
import os from 'node:os';

const __dirname = os.homedir();
await kernel.run([__dirname]);