import _ from 'lodash';

const stylish = (tree, replacer = ' ', spacesCount = 4) => {
  const iter = (data, depth) => {
    if (!_.isObject(data)) {
      return `${data}`;
    }
    const indentSize = ((depth * spacesCount) - 2);
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - 2);
    const currentValue = _.isPlainObject(data) ? Object.keys(data) : data;
    const line = currentValue.map((node) => {
      let key = node.name || node;
      const { stage } = node;

      let value = data[key] || _.cloneDeep(node.value);

      if (stage === 'added') {
        key = `+ ${key}`;
      }
      if (stage === 'deleted') {
        key = `- ${key}`;
      }

      if (stage === 'unchanged' || stage === undefined) {
        key = `  ${key}`;
      }
      if (stage === 'changed') {
        const deleted = iter(value.deleted, depth + 1);
        const { added } = value;
        return `${currentIndent}- ${node.name}: ${deleted}\n${currentIndent}+ ${node.name}: ${added}`;
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
