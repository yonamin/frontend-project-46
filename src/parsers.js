import yaml from 'js-yaml';

const parse = (file, extname) => {
  let parsed;
  if (extname === '.json') {
    parsed = JSON.parse(file);
  }
  if (extname === '.yaml' || extname === '.yml') {
    parsed = yaml.load(file);
  }
  return parsed;
};

export default parse;
