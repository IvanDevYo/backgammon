import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            ui: path.resolve(__dirname, 'src/ui'),
            core: path.resolve(__dirname, 'src/core')
        }
    }
});
