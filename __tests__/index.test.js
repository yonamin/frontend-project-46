import path, { dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const yaml1 = getFixturePath('file1.yml');
const yaml2 = getFixturePath('file2.yml');
const json1 = getFixturePath('file1.json');
const json2 = getFixturePath('file2.json');
const expectedStylish = readFileSync(getFixturePath('expected.stylish.txt'), 'utf8');
const expectedPlain = readFileSync(getFixturePath('expected.plain.txt'), 'utf8');
const expectedJson = readFileSync(getFixturePath('expected.json'), 'utf8');
test.each([
  [yaml1, yaml2, 'stylish', expectedStylish],
  [json1, json2, 'stylish', expectedStylish],
  [json1, yaml2, 'plain', expectedPlain],
  [json1, json2, 'json', expectedJson],
])('should work', (file1, file2, format, expected) => {
  expect(genDiff(file1, file2, format)).toEqual(expected);
});
