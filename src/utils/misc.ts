export function deriveNameFromExec(exec: string): string {
    const parts = exec.trim().split(' ');
    const base = parts[0].split('/').pop() || 'job';

    // remove the file extension
    const withoutExt = base.replace(/\.(sh|py|ts|js|pl|rb|exe|bin)$/, '');

    // replace illegal chars, then trim leading/trailing hyphens
    return withoutExt
        .replaceAll(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/^-+|-+$/g, '');
}
