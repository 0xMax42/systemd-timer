import { assertEquals } from '@std/assert';
import { deriveNameFromExec } from '../mod.ts';

Deno.test(
    'deriveNameFromExec - entfernt Pfad, Endung und Sonderzeichen',
    () => {
        const tests: Array<[string, string]> = [
            ['/usr/local/bin/backup.sh', 'backup'],
            ['/usr/bin/python3 /home/user/myscript.py', 'python3'],
            ['./my-job.ts', 'my-job'],
            ['node ./tools/start.js', 'node'],
            ['/bin/custom-script.rb', 'custom-script'],
            ['  /usr/bin/something-strange!.bin  ', 'something-strange'],
            ['weird:name?.sh', 'weird-name'],
            ['', 'job'],
        ];

        for (const [input, expected] of tests) {
            assertEquals(deriveNameFromExec(input), expected);
        }
    },
);
