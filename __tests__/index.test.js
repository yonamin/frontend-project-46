import path, { dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';
import stylish from '../src/stylish.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('should work', () => {
  const expected = readFileSync(getFixturePath('expected.txt'), 'utf8');

  const yaml1 = getFixturePath('file1.yml');
  const yaml2 = getFixturePath('file2.yml');
  expect(stylish(genDiff(yaml1, yaml2))).toEqual(expected);

  const json1 = getFixturePath('file1.json');
  const json2 = getFixturePath('file2.json');
  expect(stylish(genDiff(json1, json2))).toEqual(expected);
});
