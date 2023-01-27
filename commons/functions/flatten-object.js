 function flattenObject(obj, mainKey=''){
    let ans = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        
        const currentKey = mainKey !== '' ? mainKey+'.'+key : key;
        if (typeof obj[key] === 'object' && ! (obj[key] instanceof Date)){
          ans = {...ans, ...flattenObject(obj[key], currentKey)}
        }else{
          ans[currentKey] = obj[key];
        }
      }
    }
    return ans;
  }

  module.exports.flattenObject = flattenObject;