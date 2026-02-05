export async function readStdin() {
    const chunks = [];
    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }
    const input = Buffer.concat(chunks).toString('utf8').trim();
    if (!input) {
        return {};
    }
    try {
        return JSON.parse(input);
    }
    catch {
        return {};
    }
}
