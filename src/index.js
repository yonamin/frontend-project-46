import { readFileSync } from 'fs';
import path from 'path';
import { cwd } from 'process';
import _ from 'lodash';
import parse from './parsers.js';
import chooseFormat from '../formatters/index.js';

const gendiff = (file1, file2) => {
  const diff = (data1, data2) => {
    const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
    const result = keys.map((key) => {
      const value1 = _.cloneDeep(data1[key]);
      const value2 = _.cloneDeep(data2[key]);
      const node = {};
      node.name = key;

      if (!Object.hasOwn(data1, key)) {
        node.stage = 'added';
        node.value = value2;
        return node;
      }
      if (!Object.hasOwn(data2, key)) {
        node.stage = 'removed';
        node.value = value1;
        return node;
      }
      if ((_.isPlainObject(value1)) && (_.isPlainObject(value2))) {
        node.value = diff(value1, value2);
        node.stage = 'nested';
        return node;
      }

      if (value1 === value2) {
        node.stage = 'unchanged';
        node.value = value1;
        return node;
      }

      node.stage = 'updated';
      node.value = { removed: value1, added: value2 };
      return node;
    });
    return result;
  };
  return diff(file1, file2);
};
export default (filepath1, filepath2, format = 'stylish') => {
  const extname1 = path.extname(filepath1);
  const extname2 = path.extname(filepath2);
  const parsedFile1 = parse(readFileSync(path.resolve(cwd(), filepath1)), extname1);
  const parsedFile2 = parse(readFileSync(path.resolve(cwd(), filepath2)), extname2);
  return chooseFormat(gendiff(parsedFile1, parsedFile2), format);
};
