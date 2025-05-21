import { Command } from '@cliffy/command';
import { createCommand } from './create.ts';

await new Command()
    .name('systemd-timer')
    .version('0.1.0')
    .description('CLI Tool zum Erzeugen von systemd .timer und .service Units')
    .command('create', createCommand)
    .parse(Deno.args);
