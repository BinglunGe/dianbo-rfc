'use strict';

const { program } = require('commander');
const process = require('process');
const fse = require('fs-extra');

program
    .requiredOption('-f, --file <path>', 'Input file')
    .parse(process.argv);

(async () => {
    const text = '' + await fse.readFile(program.file);
    const lines = text.split('\n');
    const maxLineWidth = lines.reduce((len, item) => len > item.length ? len : item.length, 0);

    process.stdout.write(`${maxLineWidth}\n`);
})().catch(e => console.log(e));
