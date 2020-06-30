#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const process = require('process');
const fse = require('fs-extra');

program
    .requiredOption('-f, --file <path>', 'Input file')
    .parse(process.argv);

(async () => {
    let text = '' + await fse.readFile(program.file);

    text = text.replace(/，\s*$/mg, ',');
    text = text.replace(/，/g, ', ');

    text = text.replace(/：\s*$/mg, ':');
    text = text.replace(/：/g, ': ');

    text = text.replace(/；\s*$/mg, ';');
    text = text.replace(/；/g, '; ');

    await fse.writeFile(program.file, text);
    console.log('Done');
})().catch(e => console.log(e));
