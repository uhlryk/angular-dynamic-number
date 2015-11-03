/*jslint node: true */
(function(window, angular, undefined) {"use strict";
  function convModelToView(modelValue, viewSeparator){
    if(viewSeparator === ',') {
      return String(modelValue).replace(".",",");
    } else {
      return String(modelValue);
    }
  }
  function convViewToModel(viewValue, viewSeparator) {
    if(viewSeparator === ',') {
      return String(viewValue).replace(/\./g,"").replace(",",".");
    } else {
      return String(viewValue).replace(/,/g,"");
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
  function initIsFixed(attrs_fixed, def_fixed){
    if(attrs_fixed === 'false') {
      return false;
    } else if(attrs_fixed === 'true') {
      return true;
    }
    return def_fixed;
  }
  function initIsThousand(attrs_thousand, def_thousand){
    if(attrs_thousand === 'false') {
      return false;
    } else if(attrs_thousand === 'true') {
      return true;
    }
    return def_thousand;
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
    return String(value).replace(/^0+/g, "").replace(/^-00+/g, "-0").replace(/-0+\[\.,]/, "-0$&").replace(/^[\.,]/g, "0$&");
  }
  function removeThousandSeparators(value, thousandSeparator){
    if(thousandSeparator === '.') {
      return String(value).replace(/\./g, "");
    } else {
      return String(value).replace(/,/g, "");
    }
  }
  function addThousandSeparator(value, thousandSeparator){
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  }
  function changeViewValue(ngModelController, value){
    // https://github.com/angular/angular.js/issues/13068
    // ngModelController.$viewValue = value;
    ngModelController.$setViewValue(value);
    ngModelController.$render();
  }
  function filterModelValue(value, fractionPart, fractionSeparator, roundFunction, numFixed, isThousandSeparator){
    value = Number(value);
    if(!isNaN(value) && isFinite(value)) {
      var powerOfTen = Math.pow(10, fractionPart);
      if(numFixed) {
        value =  convModelToView((roundFunction(value*powerOfTen)/powerOfTen).toFixed(fractionPart), fractionSeparator);
      } else {
        value =  convModelToView(String(roundFunction(value*powerOfTen)/powerOfTen), fractionSeparator);
      }
      if(isThousandSeparator){
        value = addThousandSeparator(value, fractionSeparator==='.'?',':'.');
      }
      return value;
    }
    if(numFixed) {
      return (0).toFixed(fractionPart);
    } else {
      return "0";
    }
  }
  /**
   * from this source:
   * http://stackoverflow.com/a/2897229/4138339
   */
  function getCaretPosition (oField) {
    var iCaretPos = 0;
    if (document.selection) {
      oField.focus ();
      var oSel = document.selection.createRange ();
      oSel.moveStart ('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    }
    else if (oField.selectionStart || oField.selectionStart == '0')
      iCaretPos = oField.selectionStart;
    return (iCaretPos);
  }
  /**
   * from this source
   * http://stackoverflow.com/a/22574572/4138339
   */
  function setCaretPosition(elem, caretPos) {
    if (elem !== null) {
      if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        if (elem.selectionStart) {
          elem.focus();
          elem.setSelectionRange(caretPos, caretPos);
        } else
        elem.focus();
      }
    }
  }
  function countThousandSeparatorToPosition(value,separator, position){
    var countPosition = 0;
    var countDots = 0;
    for(var i =0; i < value.length;i++){
      if(value[i] !== separator){
        countPosition ++;
        if(countPosition >= position)break;
      } else {
        countDots ++;
      }
    }
    return countDots;
  }
  function dynamicNumberDirective(dynamicNumberStrategy) {
    return {
      restrict:'A',
      require: '?ngModel',
      scope: {
        awnum: "@",
        numInt: "@",
        numFract: "@",
        numSep: "@",
        numPos: "@",
        numNeg: "@",
        numRound: "@",
        numThousand: "@"
      },
      link: function(scope, element, attrs, ngModelController) {
        var integerPart = initIntegerPart(scope.numInt, 6);
        var fractionPart = initFractionPart(scope.numFract, 2);
        var fractionSeparator = initSeparator(scope.numSep, '.');
        var isPositiveNumber = initIsPositive(scope.numPos, true);
        var isNegativeNumber = initIsNegative(scope.numNeg, true);
        var roundFunction = initRound(scope.numRound, Math.round);
        var isThousandSeparator = initIsThousand(scope.numThousand, false);

        if(isPositiveNumber === false && isNegativeNumber === false) {
          throw new Error('Number is set to not be positive and not be negative. Change num_pos attr or/and num_neg attr to true');
        }
        var viewRegexTest = buildRegexp(integerPart, fractionPart, fractionSeparator, isPositiveNumber, isNegativeNumber);
        ngModelController.$parsers.unshift(function(value){
          var parsedValue = String(value);
          var cursorPosition = getCaretPosition(element[0]);
          var valBeforeCursor = parsedValue.slice(0,cursorPosition);
          var valLengthBeforeCursor = valBeforeCursor.length;

          valBeforeCursor = removeThousandSeparators(valBeforeCursor, fractionSeparator==='.'?',':'.');
          parsedValue = removeThousandSeparators(parsedValue, fractionSeparator==='.'?',':'.');
          valBeforeCursor = removeLeadingZero(valBeforeCursor);
          parsedValue = removeLeadingZero(parsedValue);

          if(parsedValue === '' && String(value).charAt(0)=== '0'){
            changeViewValue(ngModelController, 0);
            return 0;
          }
          if(parsedValue === undefined || parsedValue === ''){
            return 0;
          }
          if(parsedValue === '-'){
            changeViewValue(ngModelController, '-');
            return 0;
          }
          /**
           * view value failed 'correct view format' test
           * therefore view value is set from last correct model value (it must be formatted - change dot to comma)
           */
          if(viewRegexTest.test(parsedValue) === false){
            var modelValue = convModelToView(ngModelController.$modelValue, fractionSeparator);
            if(isThousandSeparator){
              modelValue = addThousandSeparator(modelValue, fractionSeparator==='.'?',':'.');
            }
            changeViewValue(ngModelController, modelValue);
            setCaretPosition(element[0],cursorPosition-1);
            return ngModelController.$modelValue;
          }
          /**
           * view value success 'correct view format' test
           * therefore model value is set from correct view value (it must be formatter - change comma to dot)
           */
          else {
            var dots = 0;
            var currentPosition = cursorPosition - valLengthBeforeCursor + valBeforeCursor.length;
            if(isThousandSeparator){
              parsedValue = addThousandSeparator(parsedValue, fractionSeparator==='.'?',':'.');
              dots = countThousandSeparatorToPosition(parsedValue,fractionSeparator==='.'?',':'.',currentPosition);
            }
            changeViewValue(ngModelController, parsedValue);
            setCaretPosition(element[0],currentPosition + dots);
            return convViewToModel(parsedValue, fractionSeparator);
          }
        });
        /**
         * it is like filter,
         */
        ngModelController.$formatters.push(function(value){
          return filterModelValue(value, fractionPart, fractionSeparator, roundFunction, false, isThousandSeparator);
        });
      }
    };
  }
  /**
   * filter does not validate data only filter fraction part and decimal separator
   */
  function dynamicNumberFilter(){
    return function(value, numFract, numSep, numRound, numFixed, numThousand) {
      var fractionPart = initFractionPart(numFract, 2);
      var fractionSeparator = initSeparator(numSep, '.');
      var roundFunction = initRound(numRound, Math.round);
      var isFixed = initIsFixed(numFixed, false);
      var isThousandSeparator = initIsThousand(numThousand, false);
      return filterModelValue(value, fractionPart, fractionSeparator, roundFunction, isFixed, isThousandSeparator);
    };
  }
  angular.module('dynamicNumber',[])
  .provider('dynamicNumberStrategy', function() {
    var strategies = {};
    this.addStrategy = function(name, strategy){
      strategies[name]=strategy;
    };
    this.getStrategy = function(name) {
      return strategies[name];
    };
    this.$get = function(){
      return {
        getStrategy: function(name) {
          return strategies[name];
        }
      };
    };
  })
  .filter('awnum', function() {
    return function(value, numFract, numSep, numRound, numFixed, numThousand) {
      var fractionPart = initFractionPart(numFract, 2);
      var fractionSeparator = initSeparator(numSep, '.');
      var roundFunction = initRound(numRound, Math.round);
      var isFixed = initIsFixed(numFixed, false);
      var isThousandSeparator = initIsThousand(numThousand, false);
      return filterModelValue(value, fractionPart, fractionSeparator, roundFunction, isFixed, isThousandSeparator);
    };
  })
  .directive('awnum', ['dynamicNumberStrategy',dynamicNumberDirective]);
})(window,window.angular);