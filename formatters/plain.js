import _ from 'lodash';

const setQuotes = (item) => {
  if (typeof item === 'string') {
    return `'${item}'`;
  }
  return item;
};

const plain = (tree) => {
  const iter = (item, ancestry) => {
    const currentProperty = _.isPlainObject(item) ? Object.keys(item) : item;

    const result = currentProperty.reduce((acc, node) => {
      const value = _.isObject(node.value) ? '[complex value]' : setQuotes(node.value);
      const { name } = node;
      const newAncestry = `${ancestry}.${name}`;
      const { stage } = node;
      let tail;
      let removed;
      let added;
      if (stage !== 'unchanged') {
        switch (stage) {
          case 'nested':
            acc.push(iter(node.value, newAncestry));
            return acc;
          case 'added':
            tail = `added with value: ${value}`;
            break;
          case 'removed':
            tail = 'removed';
            break;
          default:
            removed = _.isObject(node.value.removed) ? '[complex value]' : `${setQuotes(node.value.removed)}`;
            added = _.isObject(node.value.added) ? '[complex value]' : `${setQuotes(node.value.added)}`;
            tail = `updated. From ${removed} to ${added}`;
        }
        acc.push([`Property '${newAncestry.slice(1)}' was ${tail}`]);
        acc.flat();
      }
      return acc;
    }, []);
    return result.join('\n');
  };
  return iter(tree, '');
};
export default plain;
