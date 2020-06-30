#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const process = require('process');
const fse = require('fs-extra');
const path = require('path');

program
    .requiredOption('-i, --input <file>', 'Input file')
    .option('-o, --output <file>', 'Input file')
    .parse(process.argv);

const args = {};
args.inFile = program.input;
args.dir = path.dirname(args.inFile);
args.ext = path.extname(args.inFile);
args.base = path.basename(args.inFile, args.ext);
args.dftFile = path.join(args.dir, `${args.base}_trans${args.ext}`);
args.outFile = program.output || args.dftFile;

(async () => {
    let text = '' + await fse.readFile(args.inFile);

    const errSig = '' + 'errorr'.repeat(20) + 'e';

    { // 中文逗号、中文冒号、中文分号
        text = errPat(text, /^[ \t]*，/mg, errSig); // 1. 行首的中文逗号
        text = text.replace(/，[ \t]*$/mg, ','); // 2. 行末的中文逗号
        text = text.replace(/，[ \t]*/g, ', '); // 3. 剩余的中文逗号

        text = errPat(text, /^[ \t]*：/mg, errSig); // 1. 行首的中文冒号
        text = text.replace(/：[ \t]*$/mg, ':'); // 2. 行末的中文冒号
        text = text.replace(/：[ \t]*/g, ': '); // 3. 剩余的中文冒号

        text = errPat(text, /^[ \t]*；/mg, errSig); // 1. 行首的中文分号
        text = text.replace(/；[ \t]*$/mg, ';'); // 2. 行末的中文分号
        text = text.replace(/；[ \t]*/g, '; '); // 3. 剩余的中文分号
    }
    { // 中文括号、中文双引号、中文单引号
        { // 中文括号
            text = text.replace(/^([ \t]*)（/mg, '$1('); // 1. 行首的中文左括号
            text = errPat(text, /（[ \t]*$/mg, errSig); // 2. 行末的中文左括号
            text = text.replace(/、[ \t]*（/g, '、('); // 3. 顿号后跟中文左括号
            text = text.replace(/[ \t]*（/g, ' ('); // 4. 剩余的中文左括号

            text = errPat(text, /^[ \t]*）/mg, errSig); // 1. 行首的中文右括号
            text = text.replace(/）[ \t]*$/mg, ')'); // 2. 行末的中文右括号
            text = text.replace(/）[ \t]*([。，；、；.,;;])/g, ')$1'); // 3. 中文右括号后跟其它符号
            text = text.replace(/）[ \t]*/g, ') '); // 4. 剩余的中文右括号
        }
        { //中文双引号
            text = text.replace(/^([ \t]*)“/mg, '$1"'); // 1. 行首的中文左双引号
            text = errPat(text, /“[ \t]*$/mg, errSig); // 2. 行末的中文左双引号
            text = text.replace(/、[ \t]*“/g, '、"'); // 3. 顿号后跟中文左双引号
            text = text.replace(/[ \t]*“/g, ' "'); // 4. 剩余的中文左双引号

            text = errPat(text, /^[ \t]*”/mg, errSig); // 1. 行首的中文右双引号
            text = text.replace(/”[ \t]*$/mg, '"'); // 2. 行末的中文右双引号
            text = text.replace(/”[ \t]*([。，；；、.,;;])/g, '"$1'); // 3. 中文右双引号后跟其它符号
            text = text.replace(/”[ \t]*/g, '" '); // 4. 剩余的中文右双引号
        }
        { //中文单引号
            text = text.replace(/^([ \t]*)‘/mg, "$1'"); // 1. 行首的中文左单引号
            text = errPat(text, /‘[ \t]*$/mg, errSig); // 2. 行末的中文左单引号
            text = text.replace(/、[ \t]*‘/g, "、'"); // 3. 顿号后跟中文左单引号
            text = text.replace(/[ \t]*‘/g, " '"); // 4. 剩余的中文左单引号

            text = errPat(text, /^[ \t]*’/mg, errSig); // 1. 行首的中文右单引号
            text = text.replace(/’[ \t]*$/mg, "'"); // 2. 行末的中文右单引号
            text = text.replace(/’[ \t]*([。，；；、.,;;])/g, "'$1"); // 3. 中文右单引号后跟其它符号
            text = text.replace(/’[ \t]*/g, "' "); // 4. 剩余的中文右单引号
        }
    }

    const errList = text.match(RegExp(errSig, 'g'));
    if (errList !== null)
        console.log(`Find ${errList.length} errors`);

    await fse.writeFile(args.outFile, text);
    console.log('Done');
})().catch(e => console.log(e));

function errPat(str, pat, msg) {
    let src = pat.source;
    if (src[0] !== '(') src = '(' + src;
    if (src[src.length - 1] !== ')') src = src + ')';
    pat = new RegExp(src, pat.flags);

    return str.replace(pat, `$1\n${msg}\n`);
}
