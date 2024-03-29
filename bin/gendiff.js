#!/usr/bin/env node
import { program } from 'commander';
import compare from '../src/index.js';

program
  .name('gendiff')
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2) => {
    const { format } = program.opts();
    console.log(compare(filepath1, filepath2, format));
  });

program.parse();
