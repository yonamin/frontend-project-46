import json from './json.js';
import plain from './plain.js';
import stylish from './stylish.js';

const chooseFormat = (data, format) => {
  if (format === 'stylish') {
    return stylish(data);
  }
  if (format === 'plain') {
    return plain(data);
  }
  if (format === 'json') {
    return json(data);
  }
  return 'Unknown format';
};
export default chooseFormat;
