import type { StdinData } from './types.js';
import { safeJsonParse, isValidStdinInput } from './validation.js';

export async function readStdin(): Promise<StdinData> {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  const input = Buffer.concat(chunks).toString('utf8').trim();

  if (!input) {
    return {};
  }

  const parsed = safeJsonParse(input, isValidStdinInput);
  return parsed ?? {};
}
