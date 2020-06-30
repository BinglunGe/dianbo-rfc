#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const process = require('process');
const { promisify } = require('util');
const execFile = promisify(require('child_process').execFile);
const path = require('path');
const fse = require('fs-extra');


program
    .requiredOption('-i, --index <int>', 'RFC index')
    .parse(process.argv);

const args = {};
args.index = program.index;

(async () => {
    const dir = path.join(__dirname, `../rfc/rfc${args.index}`);
    const text = path.join(dir, `rfc${args.index}.txt`);
    const text_zh = path.join(dir, `rfc${args.index}_zh.txt`);
    {
        console.log(`Downloading RFC ${args.index}:`);
        const script = path.join(__dirname, 'downloadRFC.js');
        const { stdout, stderr } = await execFile(script, ['-i', args.index, '-d', dir]);
        console.log(stdout, stderr);
    }
    {
        console.log(`Max line width of ${path.basename(text)}:`);
        const script = path.join(__dirname, 'maxLineWidth.js');
        const { stdout, stderr } = await execFile(script, ['-f', text]);
        console.log(stdout, stderr);
    }
    {
        console.log(`Create ${path.basename(text_zh)}:`);
        if (await fse.pathExists(text_zh)) {
            console.log(`Already exists: ${text_zh}\n`);
        } else {
            await fse.copy(text, text_zh);
            console.log('Done\n');
        }
    }
    {
        console.log(`Max line width of ${path.basename(text_zh)}:`);
        const script = path.join(__dirname, 'maxLineWidth.js');
        const { stdout, stderr } = await execFile(script, ['-f', text_zh]);
        console.log(stdout, stderr);
    }
    {
        console.log(`Transform Chinese mark in ${path.basename(text_zh)}:`);
        const script = path.join(__dirname, 'zhMarkTrans.js');
        const { stdout, stderr } = await execFile(script, ['-i', text_zh, '-o', text_zh]);
        console.log(stdout, stderr);
    }
    {
        console.log(`Max line width of ${path.basename(text_zh)}:`);
        const script = path.join(__dirname, 'maxLineWidth.js');
        const { stdout, stderr } = await execFile(script, ['-f', text_zh]);
        console.log(stdout, stderr);
    }
})().catch(e => console.log(e));