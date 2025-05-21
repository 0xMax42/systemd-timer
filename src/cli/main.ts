import { Command } from '@cliffy/command';
import { createCommand } from './create.ts';
import { getVersion } from '../utils/mod.ts';

await new Command()
    .name('systemd-timer')
    .version(await getVersion())
    .description('CLI Tool zum Erzeugen von systemd .timer und .service Units')
    .command('create', createCommand)
    .parse(Deno.args);
