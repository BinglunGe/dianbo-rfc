#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const process = require('process');
const fse = require('fs-extra');
const path = require('path');
const https = require('https');

program
    .requiredOption('-i, --index <int>', 'RFC index')
    .requiredOption('-d, --dir <path>', 'Output directory')
    .parse(process.argv);

const args = {}
args.index = program.index;
args.dir = program.dir;
args.url = `https://www.rfc-editor.org/rfc/rfc${args.index}.txt`;
args.file = path.join(args.dir, `rfc${args.index}.txt`);

(async () => {
    await fse.ensureDir(args.dir);
    const data = await httpsGet(args.url);
    await fse.writeFile(args.file, data);
    console.log('Done');
})().catch(e => console.log(e));


function httpsGet(url) {
    return new Promise((resolve, reject) => {
        let data = '';
        https.get(url, (response) => {
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => { resolve(data); });
        }).on('error', reject);
    });
};