import _ from 'lodash';

const stylish = (tree, replacer = ' ', spacesCount = 4) => {
  const stringify = (item, depth) => {
    if (!_.isObject(item) || item === null) {
      return String(item);
    }

    const indentSize = ((depth * spacesCount) - 2);
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - 2);

    const currentVal = _.isPlainObject(item) ? Object.entries(item) : item;
    const lines = currentVal.flatMap((node) => {
      const { stage } = node;
      if (!stage) {
        const [key, value] = node;
        return `${currentIndent}  ${key}: ${stringify(value, depth + 1)}`;
      }
      const getSign = (status) => {
        switch (status) {
          case 'added':
            return '+';
          case 'removed':
            return '-';
          default:
            return ' ';
        }
      };

      const sign = getSign(stage);
      const key = `${sign} ${node.name}`;
      const value = stringify(node.value, depth + 1);

      if (stage === 'nested') {
        return `${currentIndent}${key}: ${stringify(node.children, depth + 1)}`;
      }
      if (stage === 'updated') {
        const removed = stringify(node.value.removed, depth + 1);
        const added = stringify(node.value.added, depth + 1);
        return `${currentIndent}- ${node.name}: ${removed}\n${currentIndent}+ ${node.name}: ${added}`;
      }

      return `${currentIndent}${key}: ${value}`;
    });

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return stringify(tree, 1);
};
export default stylish;
