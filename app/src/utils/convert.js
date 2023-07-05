export const convertArrayToObject = (array, key = '_id') => {
  return array.reduce((pre, cur) => {
    return ({ ...pre, [cur[key]]: cur })
  }, {})
};
