import _ from 'lodash';

const stylish = (tree, replacer = ' ', spacesCount = 4) => {
  const stringify = (item, depth) => {
    if (!_.isObject(item) || item === null) {
      return String(item);
    }

    const indentSize = ((depth * spacesCount) - 2);
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - 2);

    const getLines = (arr) => arr.flatMap((node) => {
      const { stage } = node;
      if (!stage) {
        const [key, value] = node;
        return `${currentIndent}  ${key}: ${stringify(value, depth + 1)}`;
      }
      const key = node.name;
      const value = stringify(node.value, depth + 1);
      switch (stage) {
        case 'added':
          return `${currentIndent}+ ${key}: ${value}`;
        case 'removed':
          return `${currentIndent}- ${key}: ${value}`;
        case 'nested':
          return `${currentIndent}  ${key}: ${stringify(node.children, depth + 1)}`;
        case 'updated': {
          const removed = stringify(node.value.removed, depth + 1);
          const added = stringify(node.value.added, depth + 1);
          return `${currentIndent}- ${node.name}: ${removed}\n${currentIndent}+ ${node.name}: ${added}`;
        }
        case 'unchanged':
          return `${currentIndent}  ${key}: ${value}`;
        default:
          return `Unknown stage ${stage}`;
      }
    });
    const currentVal = _.isPlainObject(item) ? Object.entries(item) : item;
    const lines = getLines(currentVal);
    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return stringify(tree, 1);
};
export default stylish;
