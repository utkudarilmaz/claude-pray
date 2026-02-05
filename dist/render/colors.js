// ANSI color codes for terminal output
export const colors = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    red: '\x1b[31m',
};
export function cyan(text) {
    return `${colors.cyan}${text}${colors.reset}`;
}
export function yellow(text) {
    return `${colors.yellow}${text}${colors.reset}`;
}
export function green(text) {
    return `${colors.green}${text}${colors.reset}`;
}
export function dim(text) {
    return `${colors.dim}${text}${colors.reset}`;
}
export function red(text) {
    return `${colors.red}${text}${colors.reset}`;
}
