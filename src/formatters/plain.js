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

const plain = (tree) => {
  const iter = (item, ancestry) => {
    const getLines = (arr) => arr
      .filter((node) => node.stage !== 'unchanged')
      .flatMap((node) => {
        const { stage } = node;
        const { name } = node;
        const newAncestry = `${ancestry}.${name}`;
        if (stage === 'nested') {
          return iter(node.children, newAncestry);
        }
        const value = normalizeValue(node.value);
        switch (stage) {
          case 'added':
            return `Property '${newAncestry.slice(1)}' was added with value: ${value}`;
          case 'removed':
            return `Property '${newAncestry.slice(1)}' was removed`;
          case 'updated': {
            const removed = `${normalizeValue(node.value.removed)}`;
            const added = `${normalizeValue(node.value.added)}`;
            return `Property '${newAncestry.slice(1)}' was updated. From ${removed} to ${added}`;
          }
          default:
            return `Unknown stage '${stage}'`;
        }
      });
    const lines = getLines(item);
    return lines.join('\n');
  };
  return iter(tree, '');
};
export default plain;
