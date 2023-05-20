import _ from 'lodash';

const getLines = (arr, indent, depth, stringify) => arr.flatMap((node) => {
  const { stage } = node;
  if (!stage) {
    const [key, value] = node;
    return `${indent}  ${key}: ${stringify(value, depth + 1)}`;
  }
  const key = node.name;
  const value = stringify(node.value, depth + 1);
  switch (stage) {
    case 'added':
      return `${indent}+ ${key}: ${value}`;
    case 'removed':
      return `${indent}- ${key}: ${value}`;
    case 'nested':
      return `${indent}  ${key}: ${stringify(node.children, depth + 1)}`;
    case 'updated': {
      const removed = stringify(node.value.removed, depth + 1);
      const added = stringify(node.value.added, depth + 1);
      return `${indent}- ${node.name}: ${removed}\n${indent}+ ${node.name}: ${added}`;
    }
    case 'unchanged':
      return `${indent}  ${key}: ${value}`;
    default:
      return `Unknown stage ${stage}`;
  }
});
const stringify = (item, depth, replacer = ' ', spacesCount = 4) => {
  if (!_.isObject(item) || item === null) {
    return String(item);
  }

  const indentSize = ((depth * spacesCount) - 2);
  const currentIndent = replacer.repeat(indentSize);
  const bracketIndent = replacer.repeat(indentSize - 2);

  const currentVal = _.isPlainObject(item) ? Object.entries(item) : item;
  const lines = getLines(currentVal, currentIndent, depth, stringify);
  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};
const stylish = (tree) => stringify(tree, 1);
export default stylish;
