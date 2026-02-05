import { readStdin } from './stdin.js';
import { getConfig } from './config.js';
import { render } from './render/index.js';
async function main() {
    try {
        const stdinData = await readStdin();
        const config = await getConfig();
        const output = await render(stdinData, config);
        process.stdout.write(output);
    }
    catch (error) {
        // Silently fail - statusline should not crash Claude Code
        process.stdout.write('');
    }
}
main();
