/*jslint node: true */
"use strict";
function convModelToView(modelValue, viewSeparator){
  if(viewSeparator === ',') {
    return String(modelValue).replace(".",",");
  } else {
    return modelValue;
  }
}
function convViewToModel(viewValue, viewSeparator) {
  if(viewSeparator === ',') {
    return String(viewValue).replace(",",".");
  } else {
    return viewValue;
  }
}
function initIntegerPart(attrs_num_int, def_num_int){
  if(attrs_num_int >= 0){
    var _num_int = parseInt(attrs_num_int,10);
    if(isNaN(_num_int) === false && isFinite(_num_int) && _num_int >= 0){
      return _num_int;
    }
  }
  return def_num_int;
}
function initFractionPart(attrs_num_fract, def_num_fract){
  if(attrs_num_fract >= 0){
    var _num_fract = parseInt(attrs_num_fract,10);
    if(isNaN(_num_fract) === false && isFinite(_num_fract) && _num_fract >= 0){
      return _num_fract;
    }
  }
  return def_num_fract;
}
function initSeparator(attrs_num_sep, def_num_sep){
  if(attrs_num_sep === ','){
     return ',';
  } else if(attrs_num_sep === '.'){
    return '.';
  }
  return def_num_sep;
}
function initIsPositive(attrs_num_pos, def_num_pos){
  if(attrs_num_pos === 'false') {
    return false;
  } else if(attrs_num_pos === 'true') {
    return true;
  }
  return def_num_pos;
}
function initIsNegative(attrs_num_neg, def_num_neg){
  if(attrs_num_neg === 'false') {
    return false;
  } else if(attrs_num_neg === 'true') {
    return true;
  }
  return def_num_neg;
}
function initRound(attrs_round, def_round){
  if(attrs_round === 'floor') {
    return Math.floor;
  } else if(attrs_round === 'ceil') {
    return Math.ceil;
  } else if(attrs_round === 'round') {
    return Math.round;
  }
  return def_round;
}
function buildRegexp(integerPart, fractionPart, fractionSeparator, isPositiveNumber, isNegativeNumber){
  var negativeRegex = '-?';
  if(isPositiveNumber === false && isNegativeNumber === true) {
    negativeRegex = '-';
  } else if(isPositiveNumber === true && isNegativeNumber === false){
    negativeRegex = '';
  }
  var intRegex = '[0-9]{0,'+(integerPart)+'}';
  if(integerPart === 0){
    intRegex = '0';
  }
  var fractRegex = '(\\'+fractionSeparator+'([0-9]){0,'+fractionPart+'})';
  if(fractionPart === 0) {
    fractRegex = '';
  }
  return new RegExp('^'+negativeRegex+intRegex+fractRegex+'?$');
}
function removeLeadingZero(value){
  return value.replace(/^0+/g, "").replace(/^-00+/g, "-0").replace(/-0+\[\.,]/, "-0$&").replace(/^[\.,]/g, "0$&");
}
function changeViewValue(ngModelController, value){
  ngModelController.$viewValue = value;
  ngModelController.$render();
}
function filterModelValue(value, fractionPart, fractionSeparator, roundFunction){
  value = Number(value);
  if(!isNaN(value) && isFinite(value)) {
    var powerOfTen = Math.pow(10, fractionPart);
    return  convModelToView(String(roundFunction(value*powerOfTen)/powerOfTen), fractionSeparator);
  }
  return "0";
}
function dynamicNumberDirective() {
  return {
    restrict:'A',
    require: '?ngModel',
    scope: {
      numInt: "@",
      numFract: "@",
      numSep: "@",
      numPos: "@",
      numNeg: "@",
      numRound: "@"
    },
    link: function(scope, element, attrs, ngModelController) {
      var integerPart = initIntegerPart(scope.numInt, 6);
      var fractionPart = initFractionPart(scope.numFract, 2);
      var fractionSeparator = initSeparator(scope.numSep, '.');
      var isPositiveNumber = initIsPositive(scope.numPos, true);
      var isNegativeNumber = initIsNegative(scope.numNeg, true);
      var roundFunction = initRound(scope.numRound, Math.round);
      if(isPositiveNumber === false && isNegativeNumber === false) {
        throw new Error('Number is set to not be positive and not be negative. Change num_pos attr or/and num_neg attr to true');
      }
      var viewRegexTest = buildRegexp(integerPart, fractionPart, fractionSeparator, isPositiveNumber, isNegativeNumber);
      ngModelController.$parsers.unshift(function(value){
        var parsedValue = value;
        parsedValue = removeLeadingZero(parsedValue);
        if(parsedValue === '' && value.charAt(0)=== '0'){
          changeViewValue(ngModelController, 0);
          return 0;
        }
        if(parsedValue === undefined || parsedValue === ''){
          return 0;
        }
        if(parsedValue === '-'){
          changeViewValue(ngModelController, parsedValue);
          return 0;
        }
        /**
         * view value failed 'correct view format' test
         * therefore view value is set from last correct model value (it must be formatted - change dot to comma)
         */
        if(viewRegexTest.test(parsedValue) === false){
          changeViewValue(ngModelController, convModelToView(ngModelController.$modelValue, fractionSeparator));
          return ngModelController.$modelValue;
        }
        /**
         * view value success 'correct view format' test
         * therefore model value is set from correct view value (it must be formatter - change comma to dot)
         */
        else {
          changeViewValue(ngModelController, parsedValue);
          return convViewToModel(parsedValue, fractionSeparator);
        }
      });
      /**
       * it is like filter,
       */
      ngModelController.$formatters.push(function(value){
        return filterModelValue(value, fractionPart, fractionSeparator, roundFunction);
      });
    }
  };
}
/**
 * filter does not validate data only filter fraction part and decimal separator
 */
function dynamicNumberFilter(){
  return function(value, numFract, numSep, numRound) {
    var fractionPart = initFractionPart(numFract, 2);
    var fractionSeparator = initSeparator(numSep, '.');
    var roundFunction = initRound(numRound, Math.round);
    return filterModelValue(value, fractionPart, fractionSeparator, roundFunction);
  };
}
angular.module('dynamicNumber',[]).directive('awnum', dynamicNumberDirective).filter('awnum', dynamicNumberFilter);