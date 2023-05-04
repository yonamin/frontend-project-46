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
    const lines = item
      .filter((node) => node.stage !== 'unchanged')
      .flatMap((node) => {
        const { stage } = node;
        const { name } = node;
        const newAncestry = `${ancestry}.${name}`;
        if (stage === 'nested') {
          return iter(node.children, newAncestry);
        }
        const getTail = (status) => {
          const value = normalizeValue(node.value);
          switch (status) {
            case 'added':
              return `added with value: ${value}`;
            case 'removed':
              return 'removed';
            case 'updated': {
              const removed = `${normalizeValue(node.value.removed)}`;
              const added = `${normalizeValue(node.value.added)}`;
              return `updated. From ${removed} to ${added}`;
            }
            default:
              return `Unknown stage '${status}'`;
          }
        };

        const tail = getTail(stage);
        return `Property '${newAncestry.slice(1)}' was ${tail}`;
      });
    return lines.join('\n');
  };
  return iter(tree, '');
};
export default plain;
