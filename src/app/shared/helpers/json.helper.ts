
function stringifySortedProperties(obj, space): string {
  const allKeys = [];
  const seen = {};
  JSON.stringify(obj, (key, value) => {
    if (!(key in seen)) {
      allKeys.push(key);
      seen[key] = null;
    }
    return value;
  });
  allKeys.sort();
  return JSON.stringify(obj, allKeys, space);
}

export const jsonStringifySortedProperties = (obj, space) => stringifySortedProperties(obj, space);
