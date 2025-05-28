import { createCli } from './cli/mod.ts';
import { initI18n } from './i18n/mod.ts';

// ────────────────────────────────────────────────
// Entry Point for CLI

await initI18n();
await (await createCli()).parse(Deno.args);
