import { readFileSync } from 'fs';
import path from 'path';
import { cwd } from 'process';
import _ from 'lodash';
import parse from './parsers.js';
import chooseFormat from './formatters/index.js';

const buildTree = (file1, file2) => {
  const keys = _.sortBy(_.union(Object.keys(file1), Object.keys(file2)));
  const result = keys.map((key) => {
    const value1 = _.cloneDeep(file1[key]);
    const value2 = _.cloneDeep(file2[key]);

    if (!Object.hasOwn(file1, key)) {
      const node = {
        name: key,
        stage: 'added',
        value: value2,
      };
      return node;
    }
    if (!Object.hasOwn(file2, key)) {
      const node = {
        name: key,
        stage: 'removed',
        value: value1,
      };
      return node;
    }
    if ((_.isPlainObject(value1)) && (_.isPlainObject(value2))) {
      const node = {
        name: key,
        children: buildTree(value1, value2),
        stage: 'nested',
      };
      return node;
    }

    if (value1 === value2) {
      const node = {
        name: key,
        stage: 'unchanged',
        value: value1,
      };
      return node;
    }
    const node = {
      name: key,
      stage: 'updated',
      value: { removed: value1, added: value2 },
    };
    return node;
  });
  return result;
};

export default (filepath1, filepath2, format = 'stylish') => {
  const fileFormat1 = path.extname(filepath1).slice(1);
  const fileFormat2 = path.extname(filepath2).slice(1);
  const parsedFile1 = parse(readFileSync(path.resolve(cwd(), filepath1)), fileFormat1);
  const parsedFile2 = parse(readFileSync(path.resolve(cwd(), filepath2)), fileFormat2);
  return chooseFormat(buildTree(parsedFile1, parsedFile2), format);
};
