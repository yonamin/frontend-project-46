import plain from './plain.js';
import stylish from './stylish.js';

const chooseFormat = (data, format) => {
  switch (format) {
    case 'stylish':
      return stylish(data);
    case 'plain':
      return plain(data);
    case 'json':
      return JSON.stringify(data);
    default:
      return 'Unknown format';
  }
};
export default chooseFormat;
