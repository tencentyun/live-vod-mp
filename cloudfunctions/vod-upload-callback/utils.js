
exports.headUpperCase = function(str) {
  if (typeof str !== 'string' || !str.length) return str;
  return str.replace(/^(\w)(\w*)/, () => {
    return RegExp.$1.toUpperCase() + RegExp.$2.toLowerCase();
  })
}