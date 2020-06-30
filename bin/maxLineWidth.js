#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const process = require('process');
const fse = require('fs-extra');

const reFatChar = /[^\x00-\x7F“”]/g;

program
    .requiredOption('-f, --file <path>', 'Input file')
    .parse(process.argv);

(async () => {
    const text = '' + await fse.readFile(program.file);
    const lines = text.split('\n');
    const maxLineWidth = lines.reduce((maxWidth, item) => {
        const fatCharList = item.match(reFatChar);
        const fatCharCnt = fatCharList ? fatCharList.length : 0;
        const width = item.length + fatCharCnt;
        return maxWidth > width ? maxWidth : width;
    }, 0);

    process.stdout.write(`${maxLineWidth}\n`);
})().catch(e => console.log(e));
