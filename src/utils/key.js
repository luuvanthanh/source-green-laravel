import { isPlainObject, has, set } from 'lodash';

export const group = (object = {}) => {
  const groupObject = {};
  for (const key in object) {
    set(groupObject, key, object[key]);
  }
  return groupObject;
};

const traverseAndFlatten = (currentNode = {}, target = {}, flattednedKey) => {
  for (const key in currentNode) {
    if (has(currentNode, key)) {
      const newKey = flattednedKey ? `${flattednedKey}.${key}` : key;

      const value = currentNode[key];

      if (isPlainObject(value)) {
        traverseAndFlatten(value, target, newKey);
      } else {
        target[newKey] = value;
      }
    }
  }
};

export const flatten = (object = {}) => {
  const flattenedObject = {};
  traverseAndFlatten(object, flattenedObject);
  return flattenedObject;
};
