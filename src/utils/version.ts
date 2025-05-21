export async function getVersion(): Promise<string> {
    try {
        const versionUrl = new URL('../../VERSION', import.meta.url);
        const version = await Deno.readTextFile(versionUrl);
        return version.trim();
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return 'dev';
        }
        return 'unknown';
    }
}
