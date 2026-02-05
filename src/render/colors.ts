// ANSI color codes for terminal output
export const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
} as const;

export function cyan(text: string): string {
  return `${colors.cyan}${text}${colors.reset}`;
}

export function yellow(text: string): string {
  return `${colors.yellow}${text}${colors.reset}`;
}

export function green(text: string): string {
  return `${colors.green}${text}${colors.reset}`;
}

export function dim(text: string): string {
  return `${colors.dim}${text}${colors.reset}`;
}

export function red(text: string): string {
  return `${colors.red}${text}${colors.reset}`;
}
