import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('should works', () => {
  const expected = `{
 - follow: false
   host: hexlet.io
 - proxy: 123.234.53.22
 - timeout: 50
 + timeout: 20
 + verbose: true
}`;
  const json1 = getFixturePath('file1.json');
  const json2 = getFixturePath('file2.json');
  expect(genDiff(json1, json2)).toEqual(expected);

  const yaml1 = getFixturePath('file1.yml');
  const yaml2 = getFixturePath('file2.yml');
  expect(genDiff(yaml1, yaml2)).toEqual(expected);
});
