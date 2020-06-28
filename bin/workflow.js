#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const process = require('process');
const { promisify } = require('util');
const execFile = promisify(require('child_process').execFile);
const path = require('path');


program
    .requiredOption('-i, --index <int>', 'RFC index')
    .parse(process.argv);

const args = {};
args.index = program.index;

(async () => {
    {
        console.log(`Downloading RFC ${args.index}:`);
        const script = path.join(__dirname, 'downloadRFC.js');
        const dir = path.join(__dirname, `../rfc/rfc${args.index}`);
        const { stdout, stderr } = await execFile(script, ['-i', args.index, '-d', dir]);
        console.log(stdout, stderr);
    }
    {
        console.log(`Max line width of rfc${args.index}.txt:`);
        const script = path.join(__dirname, 'maxLineWidth.js');
        const file = path.join(__dirname, `../rfc/rfc${args.index}/rfc${args.index}.txt`);
        const { stdout, stderr } = await execFile(script, ['-f', file]);
        console.log(stdout, stderr);
    }
})().catch(e => console.log(e));