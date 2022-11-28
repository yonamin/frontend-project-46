import { readFileSync } from 'fs';
import path from 'path';
import { cwd } from 'process';
import _ from 'lodash';
import parse from './parsers.js';

const gendiff = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  const getStage = (key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    if (!Object.hasOwn(data1, key)) {
      const result = `+ ${key}: ${value2}`;
      return result;
    } if (!Object.hasOwn(data2, key)) {
      const result = `- ${key}: ${value1}`;
      return result;
    } if (value1 === value2) {
      const result = `  ${key}: ${value2}`;
      return result;
    }
    return `- ${key}: ${value1}\n + ${key}: ${value2}`;
  };

  const diff = keys.reduce((acc, key) => {
    const stage = getStage(key);
    return `${acc}\n ${stage}`;
  }, '');
  return `{${diff}\n}`;
};
export default (filepath1, filepath2) => {
  const extname1 = path.extname(filepath1);
  const extname2 = path.extname(filepath2);
  const parsedFile1 = parse(readFileSync(path.resolve(cwd(), filepath1)), extname1);
  const parsedFile2 = parse(readFileSync(path.resolve(cwd(), filepath2)), extname2);
  return gendiff(parsedFile1, parsedFile2);
};
