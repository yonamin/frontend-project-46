import _ from 'lodash';

const normalizeValue = (item) => {
  if (_.isObject(item)) {
    return '[complex value]';
  }
  if (typeof item === 'string') {
    return `'${item}'`;
  }
  return item;
};

const getLines = (arr, ancestry, iter) => arr
  .filter((node) => node.stage !== 'unchanged')
  .flatMap((node) => {
    const { stage, name } = node;
    const newAncestry = `${ancestry}.${name}`;
    switch (stage) {
      case 'added':
        return `Property '${newAncestry.slice(1)}' was added with value: ${normalizeValue(node.value)}`;
      case 'removed':
        return `Property '${newAncestry.slice(1)}' was removed`;
      case 'updated': {
        const removed = `${normalizeValue(node.value.removed)}`;
        const added = `${normalizeValue(node.value.added)}`;
        return `Property '${newAncestry.slice(1)}' was updated. From ${removed} to ${added}`;
      }
      case 'nested': {
        return iter(node.children, newAncestry);
      }
      default:
        return `Unknown stage '${stage}'`;
    }
  });
const iter = (item, ancestry) => {
  const lines = getLines(item, ancestry, iter);
  return lines.join('\n');
};

const plain = (tree) => iter(tree, '');
export default plain;
