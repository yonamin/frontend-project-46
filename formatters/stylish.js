import _ from 'lodash';

const stylish = (tree, replacer = ' ', spacesCount = 4) => {
  const iter = (item, depth) => {
    if (!_.isObject(item)) {
      return `${item}`;
    }
    const indentSize = ((depth * spacesCount) - 2);
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - 2);
    const currentValue = _.isPlainObject(item) ? Object.keys(item) : item;
    let removed;
    let added;
    const line = currentValue.map((node) => {
      let key = node.name || node;
      const { stage } = node;

      let value = item[key] || _.cloneDeep(node.value);
      switch (stage) {
        case 'added':
          key = `+ ${key}`;
          break;
        case 'removed':
          key = `- ${key}`;
          break;
        case 'updated':
          removed = iter(value.removed, depth + 1);
          added = iter(value.added, depth + 1);
          return `${currentIndent}- ${node.name}: ${removed}\n${currentIndent}+ ${node.name}: ${added}`;
        default:
          key = `  ${key}`;
      }
      value = _.isObject(value) ? iter(value, depth + 1) : value;

      return `${currentIndent}${key}: ${value}`;
    });

    return [
      '{',
      ...line,
      `${bracketIndent}}`,
    ].join('\n');
  };
  return iter(tree, 1);
};

export default stylish;
