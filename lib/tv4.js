/**
 * wrapper js for tv4 package.
 */

import tv4 from 'tv4';
import {SCHEMA_NEW_QUESTION} from 'lib/schema';

var ErrorMessages = {
  INVALID_TYPE: "參數格式錯誤: (必須是 {expected})",   // {type}
  ENUM_MISMATCH: "No enum match for: {value}",
  ANY_OF_MISSING: "Data does not match any schemas from \"anyOf\"",
  ONE_OF_MISSING: "Data does not match any schemas from \"oneOf\"",
  ONE_OF_MULTIPLE: "Data is valid against more than one schema from \"oneOf\": indices {index1} and {index2}",
  NOT_PASSED: "Data matches schema from \"not\"",
  // Numeric errors
  NUMBER_MULTIPLE_OF: "Value {value} is not a multiple of {multipleOf}",
  NUMBER_MINIMUM: "數值 {value} 不得小於最小值 {minimum}",
  NUMBER_MINIMUM_EXCLUSIVE: "Value {value} is equal to exclusive minimum {minimum}",
  NUMBER_MAXIMUM: "數值 {value} 不得大於最大值 {maximum}",
  NUMBER_MAXIMUM_EXCLUSIVE: "Value {value} is equal to exclusive maximum {maximum}",
  NUMBER_NOT_A_NUMBER: "Value {value} is not a valid number",
  // String errors
  // STRING_LENGTH_SHORT: "字元長度 ({length}) 不得小於 {minimum}",
  STRING_LENGTH_SHORT: "{key}",
  STRING_LENGTH_LONG: "字元長度 ({length} 不得大於 {maximum}",
  STRING_PATTERN: "String does not match pattern: {pattern}",
  // Object errors
  OBJECT_PROPERTIES_MINIMUM: "Too few properties defined ({propertyCount}), minimum {minimum}",
  OBJECT_PROPERTIES_MAXIMUM: "Too many properties defined ({propertyCount}), maximum {maximum}",
  // OBJECT_REQUIRED: "欄位未填寫: {key}",
  OBJECT_REQUIRED: "{key}",
  OBJECT_ADDITIONAL_PROPERTIES: "Additional properties not allowed",
  OBJECT_DEPENDENCY_KEY: "Dependency failed - key must exist: {missing} (due to key: {key})",
  // Array errors
  // ARRAY_LENGTH_SHORT: "最少必須選取 {minimum} 個項目",   // {length}
  ARRAY_LENGTH_SHORT: "{key}",
  ARRAY_LENGTH_LONG: "最多只能選取 {maximum} 個項目",    // {length}
  ARRAY_UNIQUE: "Array items are not unique (indices {match1} and {match2})",
  ARRAY_ADDITIONAL_ITEMS: "Additional items not allowed",
  // Format errors
  FORMAT_CUSTOM: "Format validation failed ({message})",
  KEYWORD_CUSTOM: "Keyword failed: {key} ({message})",
  // Schema structure
  CIRCULAR_REFERENCE: "Circular $refs: {urls}",
  // Non-standard validation options
  UNKNOWN_PROPERTY: "Unknown property (not in schema)"
};

tv4.addLanguage('zh-tw', ErrorMessages);
tv4.language('zh-tw');
// tv4.setErrorReporter(function (error, data, SCHEMA_NEW_QUESTION) {
//   console.log(error);
//   console.log('error.dataPath='+error.dataPath);
//   if (error.params.key === 'no' || error.dataPath.indexOf('no') > -1) {
//     console.log('error.dataPath.indexOf(no)='+error.dataPath.indexOf('no'));
//     return "問題編號項目為必填";
//   }else if (error.params.key === 'category' || error.dataPath.indexOf('category') > -1) {
//     return "問題類別項目為必填";
//   }else if (error.params.key === 'necessaryAttribute' || error.dataPath.indexOf('necessaryAttribute') > -1) {
//     return "問題階段項目為必填";
//   }else if (error.params.key === 'type' || error.dataPath.indexOf('type') > -1) {
//     return "問題類型項目為必填";
//   }else if (error.params.key === 'answerAtrribute' || error.dataPath.indexOf('answerAtrribute') > -1) {
//     return "問題設定項目為必填";
//   }else if (error.params.key === 'content' || error.dataPath.indexOf('content') > -1) {
//     return "題目敘述項目為必填";
//   }
// });
export default tv4