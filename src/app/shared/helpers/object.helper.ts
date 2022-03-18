function toCamelCase(snakeData: any | any[]): any | any[] {
  const performConversion = (snakeObj) => {
    if (snakeObj === null) {
      return null;
    }

    const newObj = {};
    for (const snakeProp in snakeObj) {
      const camelProp = snakeProp.replace(/(\_\w)/g, k => k[1].toUpperCase());
      newObj[camelProp] = snakeObj[snakeProp];

      if (Array.isArray(newObj[camelProp])) {
        if (typeof newObj[camelProp][0] === 'object') {
          newObj[camelProp] = newObj[camelProp].map(entry => performConversion(entry));
        }
      } else if (typeof newObj[camelProp] === 'object') {
        newObj[camelProp] = performConversion(newObj[camelProp]);
      }
    }
    return newObj;
  };
  if (Array.isArray(snakeData)) {
    return snakeData.map(entry => performConversion(entry));
  }

  return performConversion(snakeData);
}

export const snakeCaseToCamelCase = snakeObj => toCamelCase(snakeObj);
