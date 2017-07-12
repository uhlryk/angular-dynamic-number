/*jslint node: true */
(function(root, factory) {
  "use strict";

  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);

  } else if (typeof module !== 'undefined' && typeof module.exports ===
    'object') {
    module.exports = factory(require('angular'));

  } else {
    return factory(root.angular);
  }
}(window, function(angular) {
  'use strict';

  var wasPasted = false;

  function convModelToView(modelValue, viewSeparator, prepend, append) {
    if (modelValue === undefined || modelValue === null || modelValue ===
      "") {
      return "";
    }
    var newViewValue = '';
    if (viewSeparator === ',') {
      newViewValue = String(modelValue).replace(".", ",");
    } else {
      newViewValue = String(modelValue);
    }
    return newViewValue;
  }

  function convViewToModel(viewValue, viewSeparator, thousandSeparator) {

    if (viewSeparator === ',') {
      return String(viewValue).replace(/['\.\s]/g, "").replace(",", ".");
    } else if (viewSeparator === '.') {
      return String(viewValue).replace(/[',\s]/g, "");
    }
  }

  function addPrependAppend(value, prepend, append) {
    var newViewValue = value;
    if (append) {
      newViewValue = newViewValue + append;
    }
    if (prepend) {
      if (/^\-.+/.test(newViewValue)) {
        newViewValue = newViewValue.replace('-', '-' + prepend);
      } else if (/^\-/.test(newViewValue)) {
        newViewValue = newViewValue;
      } else {
        newViewValue = prepend + newViewValue;
      }
    }
    return newViewValue;
  }

  function initIntegerPart(attrs_num_int, def_num_int) {
    if (attrs_num_int >= 0) {
      var _num_int = parseInt(attrs_num_int, 10);
      if (isNaN(_num_int) === false && isFinite(_num_int) && _num_int >= 0) {
        return _num_int;
      }
    }
    return def_num_int;
  }

  function initFractionPart(attrs_num_fract, def_num_fract) {
    if (attrs_num_fract >= 0) {
      var _num_fract = parseInt(attrs_num_fract, 10);
      if (isNaN(_num_fract) === false && isFinite(_num_fract) && _num_fract >=
        0) {
        return _num_fract;
      }
    }
    return def_num_fract;
  }

  function initSeparator(attrs_num_sep, def_num_sep) {
    if (attrs_num_sep === ',') {
      return ',';
    } else if (attrs_num_sep === '.') {
      return '.';
    }
    return def_num_sep;
  }

  function initIsPositive(attrs_num_pos, def_num_pos) {
    if (attrs_num_pos === 'false' || attrs_num_pos === false) {
      return false;
    } else if (attrs_num_pos === 'true' || attrs_num_pos === true) {
      return true;
    }
    return def_num_pos;
  }

  function initIsNegative(attrs_num_neg, def_num_neg) {
    if (attrs_num_neg === 'false' || attrs_num_neg === false) {
      return false;
    } else if (attrs_num_neg === 'true' || attrs_num_neg === true) {
      return true;
    }
    return def_num_neg;
  }

  function initRound(attrs_round, def_round) {
    if (attrs_round === 'floor') {
      return Math.floor;
    } else if (attrs_round === 'ceil') {
      return Math.ceil;
    } else if (attrs_round === 'round') {
      return Math.round;
    }
    return def_round;
  }

  function initIsFixed(attrs_fixed, def_fixed) {
    if (attrs_fixed === 'false' || attrs_fixed === false) {
      return false;
    } else if (attrs_fixed === 'true' || attrs_fixed === true) {
      return true;
    }
    return def_fixed;
  }

  function initIsThousand(attrs_thousand, def_thousand) {
    if (attrs_thousand === 'false' || attrs_thousand === false) {
      return false;
    } else if (attrs_thousand === 'true' || attrs_thousand === true) {
      return true;
    }
    return def_thousand;
  }

  function initThousandSeparator(attrs_thousand, fractionSeparator,
    def_thousand) {
    if (!attrs_thousand) {
      return def_thousand;
    }
    var regexp;
    if (fractionSeparator === '.') {
      regexp = new RegExp('^[\',\\s]$');
    } else {
      regexp = new RegExp('^[\'\\.\\s]$');
    }
    if (regexp.test(attrs_thousand)) {
      return attrs_thousand;
    } else {
      return def_thousand;
    }
  }

  function initNumAppendPrepend(attrs_num_char) {
    var regexp = new RegExp('[^\\d,\\.\\s\\-]{1}');
    if (regexp.test(attrs_num_char)) {
      return attrs_num_char;
    }
    return null;
  }



  function buildRegexp(integerPart, fractionPart, fractionSeparator,
    isPositiveNumber, isNegativeNumber) {
    var negativeRegex = '-?';
    if (isPositiveNumber === false && isNegativeNumber === true) {
      negativeRegex = '-';
    } else if (isPositiveNumber === true && isNegativeNumber === false) {
      negativeRegex = '';
    }
    var intRegex = '[0-9]{0,' + (integerPart) + '}';
    if (integerPart === 0) {
      intRegex = '0';
    }
    var fractRegex = '(\\' + fractionSeparator + '([0-9]){0,' +
      fractionPart + '})';
    if (fractionPart === 0) {
      fractRegex = '';
    }
    return new RegExp('^' + negativeRegex + intRegex + fractRegex + '?$');
  }

  function removeLeadingZero(value) {
    return String(value)
      .replace(/^(-?)(0+)$/g, "$10") //change 00000 to '0' and -00000 to '-0'
      .replace(/^0(\d+)/g, "$1") //change 000001 to '1'
      .replace(/^-0(\d+)/g, "-$1") //change -013212 to -0
      .replace(new RegExp('^-([\\.,\\s])', 'g'), "-0$1") //change -. to -0.
      .replace(new RegExp('^[\\.,\\s]', 'g'), "0$&"); //change . to 0.
  }

  function removePrependAppendChars(value, prepend, append) {
    var newValue = value;
    if (prepend) {
      newValue = newValue.replace(new RegExp('[\\' + prepend + ']', 'g'),
        '');
    }
    if (append) {
      newValue = newValue.replace(new RegExp('[\\' + append + ']', 'g'), '');
    }
    return newValue;
  }

  function removeThousandSeparators(value, thousandSeparator) {
    if (thousandSeparator === '.') {
      return String(value).replace(/\./g, "");
    } else if (thousandSeparator === ',') {
      return String(value).replace(/,/g, "");
    } else {
      return String(value).replace(new RegExp('[\'\\s]', 'g'), "");
    }
  }

  function addThousandSeparator(value, fractionSeparator, thousandSeparator) {
    value = String(value).split(fractionSeparator);
    value[0] = value[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    return value.join(fractionSeparator);
  }

  function addFixedZeros(value, parameters) {
    var newValue = value;
    if (parameters.isFixed) {
      var fractionPart = newValue.split(parameters.fractionSeparator)[1];
      var fractionLength = (fractionPart && fractionPart.length) ?
        fractionPart.length : 0;
      if (fractionLength === 0) {
        newValue += parameters.fractionSeparator;
      }
      for (var i = fractionLength; i < parameters.fractionPart; i++) {
        newValue += "0";
      }
    }
    return newValue;
  }

  function changeViewValue(ngModelController, value, parameters, state,
    disable) {

    if (disable) {
      state.enable = false;
    }
    var valueString = String(value);
    var valueWithFixedZeros = addFixedZeros(valueString, parameters);
    var valueWithPrependAppend = addPrependAppend(valueWithFixedZeros,
      parameters.prepend, parameters.append);
    // https://github.com/angular/angular.js/issues/13068
    // ngModelController.$viewValue = value;
    var version = angular.version;
    if (version.major === 1 && version.minor === 2) {
      ngModelController.$viewValue = valueWithPrependAppend;
    } else {
      ngModelController.$setViewValue(valueWithPrependAppend);
    }
    ngModelController.$render();
  }

  function filterModelValue(
    value,
    fractionPart,
    fractionSeparator,
    roundFunction,
    numFixed,
    isThousandSeparator,
    thousandSeparator,
    prepend,
    append
  ) {
    if (value === '' || value === undefined || value === null) {
      return '';
    }
    value = Number(value);
    if (!isNaN(value) && isFinite(value)) {
      var powerOfTen = Math.pow(10, fractionPart);
      if (numFixed) {
        value = convModelToView((roundFunction(value * powerOfTen) /
            powerOfTen).toFixed(fractionPart), fractionSeparator, prepend,
          append);
      } else {
        value = convModelToView(String(roundFunction(value * powerOfTen) /
          powerOfTen), fractionSeparator, prepend, append);
      }
      value = addPrependAppend(value, prepend, append);
      if (isThousandSeparator) {
        value = addThousandSeparator(value, fractionSeparator,
          thousandSeparator);
      }
      return value;
    }
    if (numFixed) {
      return (0).toFixed(fractionPart);
    } else {
      return "0";
    }
  }
  /**
   * from this source:
   * http://stackoverflow.com/a/2897229/4138339
   */
  function getCaretPosition(oField) {
    var iCaretPos = 0;
    if (document.selection) {
      oField.focus();
      var oSel = document.selection.createRange();
      oSel.moveStart('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0')
      iCaretPos = oField.selectionDirection == 'backward' ? oField.selectionStart :
      oField.selectionEnd;
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

  function countThousandSeparatorToPosition(value, separator, position) {
    var countPosition = 0;
    var countDots = 0;
    for (var i = 0; i < value.length; i++) {
      if (value[i] !== separator) {
        countPosition++;
        if (countPosition >= position) break;
      } else {
        countDots++;
      }
    }
    return countDots;
  }

  function cutSurplusFractionPart(value, parameters) {

    var newValue = value;
    var splitedValue = newValue.split(parameters.fractionSeparator);
    var integerPart = splitedValue[0];
    var fractionPart = splitedValue[1];
    if (fractionPart && fractionPart.length > parameters.fractionPart) {
      fractionPart = fractionPart.slice(0, parameters.fractionPart);
      newValue = [integerPart, fractionPart].join(parameters.fractionSeparator);
    }
    return newValue;
  }

  function prepareResponse(value) {
    if (value === null) {
      return null;
    } else {
      return Number(value);
    }
  }

  function createPropertyObject(scope, key, value) {
    var properties = {
      awnum: scope.awnum,
      numInt: scope.numInt,
      numFract: scope.numFract,
      numSep: scope.numSep,
      numPos: scope.numPos,
      numNeg: scope.numNeg,
      numRound: scope.numRound,
      numThousand: scope.numThousand,
      numThousandSep: scope.numThousandSep,
      numPrepend: scope.numPrepend,
      numAppend: scope.numAppend,
      numFixed: scope.numFixed
    };
    if (key) {
      properties[key] = value;
    }
    return properties;
  }

  function removeDoubledDecimalSeparators(value, parameters) {
    return value.replace(new RegExp("[\\" + parameters.fractionSeparator +
      "]+", "g"), parameters.fractionSeparator);
  }

  function initAllProperties(properties, element, attrs, ngModelController,
    dynamicNumberStrategy) {
    var strategy = {};
    if (properties.awnum) {
      strategy = dynamicNumberStrategy.getStrategy(properties.awnum);
    }
    var integerPart = initIntegerPart(properties.numInt !== undefined ?
      properties.numInt : strategy.numInt, 6);
    var fractionPart = initFractionPart(properties.numFract !== undefined ?
      properties.numFract : strategy.numFract, 2);
    var fractionSeparator = initSeparator(properties.numSep !== undefined ?
      properties.numSep : strategy.numSep, '.');
    var isPositiveNumber = initIsPositive(properties.numPos !== undefined ?
      properties.numPos : strategy.numPos, true);
    var isNegativeNumber = initIsNegative(properties.numNeg !== undefined ?
      properties.numNeg : strategy.numNeg, true);
    var roundFunction = initRound(properties.numRound !== undefined ?
      properties.numRound : strategy.numRound, Math.round);
    var isThousandSeparator = initIsThousand(properties.numThousand !==
      undefined ? properties.numThousand : strategy.numThousand, false);
    var thousandSeparator = initThousandSeparator(properties.numThousandSep !==
      undefined ? properties.numThousandSep : strategy.numThousandSep,
      fractionSeparator, fractionSeparator === '.' ? ',' : '.');
    var prepend = initNumAppendPrepend(properties.numPrepend !== undefined ?
      properties.numPrepend : strategy.numPrepend);
    var append = initNumAppendPrepend(properties.numAppend !== undefined ?
      properties.numAppend : strategy.numAppend);
    var isFixed = initIsFixed(properties.numFixed !== undefined ?
      properties.numFixed : strategy.numFixed, false);
    if (isPositiveNumber === false && isNegativeNumber === false) {
      throw new Error(
        'Number is set to not be positive and not be negative. Change num_pos attr or/and num_neg attr to true'
      );
    }
    var viewRegexTest = buildRegexp(integerPart, fractionPart,
      fractionSeparator, isPositiveNumber, isNegativeNumber);
    return {
      element: element,
      attrs: attrs,
      ngModelController: ngModelController,
      viewRegexTest: viewRegexTest,
      integerPart: integerPart,
      fractionPart: fractionPart,
      fractionSeparator: fractionSeparator,
      isPositiveNumber: isPositiveNumber,
      isNegativeNumber: isNegativeNumber,
      roundFunction: roundFunction,
      isThousandSeparator: isThousandSeparator,
      thousandSeparator: thousandSeparator,
      prepend: prepend,
      append: append,
      isFixed: isFixed
    }
  }

  function directiveParser(value, parameters, state) {
    var element = parameters.element;
    var attrs = parameters.attrs;
    var ngModelController = parameters.ngModelController;
    var viewRegexTest = parameters.viewRegexTest;
    var integerPart = parameters.integerPart;
    var fractionPart = parameters.fractionPart;
    var fractionSeparator = parameters.fractionSeparator;
    var isPositiveNumber = parameters.isPositiveNumber;
    var isNegativeNumber = parameters.isNegativeNumber;
    var roundFunction = parameters.roundFunction;
    var isThousandSeparator = parameters.isThousandSeparator;
    var thousandSeparator = parameters.thousandSeparator;
    var prepend = parameters.prepend;
    var append = parameters.append;
    var isFixed = parameters.isFixed;

    var parsedValue = String(value);

    if (wasPasted) {
      wasPasted = false;

      // Remove all characters which are not number-relevant
      var regex = new RegExp('[^' + ((isNegativeNumber) ? '-' : '') +
        fractionSeparator + thousandSeparator + '0-9]+', 'g');
      parsedValue = parsedValue.replace(regex, '');

      // Remove trailing separators
      regex = new RegExp('^[' + fractionSeparator + thousandSeparator + ']');
      parsedValue = parsedValue.replace(regex, '');

      // Replace separator if at fraction position
      regex = new RegExp('[' + fractionSeparator + thousandSeparator +
        ']([0-9]{' + fractionPart + '})$');
      parsedValue = parsedValue.replace(regex, fractionSeparator + '$1');
    }
    parsedValue = removePrependAppendChars(parsedValue, prepend, append);
    parsedValue = removeDoubledDecimalSeparators(parsedValue, parameters);
    if (new RegExp('^[\.,' + thousandSeparator + ']{2,}').test(parsedValue)) {
      changeViewValue(ngModelController, '', parameters, state);
      return null;
    }
    var cursorPosition = getCaretPosition(element[0]);
    if (prepend) {
      cursorPosition--;
    }
    var valBeforeCursor = parsedValue.slice(0, cursorPosition);
    valBeforeCursor = removeThousandSeparators(valBeforeCursor,
      thousandSeparator);
    parsedValue = removeThousandSeparators(parsedValue, thousandSeparator);
    valBeforeCursor = removeLeadingZero(valBeforeCursor);
    var beforeRemovingLeadingZero = parsedValue;
    parsedValue = removeLeadingZero(parsedValue);
    if (parsedValue === "0" + fractionSeparator &&
      beforeRemovingLeadingZero === fractionSeparator && isPositiveNumber) {
      if (fractionPart) {
        changeViewValue(ngModelController, '' + fractionSeparator,
          parameters, state, true);
        setCaretPosition(element[0], 2);
        return null;
      } else {
        changeViewValue(ngModelController, '', parameters, state);
        return null;
      }
    }
    if (parsedValue === '' && String(value).charAt(0) === '0') {
      changeViewValue(ngModelController, '', parameters);
      return null;
    }
    if (parsedValue === undefined || parsedValue === '') {
      changeViewValue(ngModelController, '', parameters);
      return null;
    }
    if (parsedValue === '-') {
      if (isPositiveNumber && !isNegativeNumber) {
        changeViewValue(ngModelController, '', parameters, state);
      } else {
        changeViewValue(ngModelController, '-', parameters, state);
      }
      return null;
    }

    parsedValue = cutSurplusFractionPart(parsedValue, parameters);
    /**
     * view value failed 'correct view format' test
     * therefore view value is set from last correct model value (it must be formatted - change dot to comma)
     */
    if (viewRegexTest.test(parsedValue) === false) {
      var modelValue = convModelToView(ngModelController.$modelValue,
        fractionSeparator, parameters);

      if (isThousandSeparator) {
        modelValue = addThousandSeparator(modelValue, fractionSeparator,
          thousandSeparator);
      }
      changeViewValue(ngModelController, modelValue, parameters, state);
      setCaretPosition(element[0], cursorPosition - 1);
      return ngModelController.$modelValue;
    }
    /**
     * view value success 'correct view format' test
     * therefore model value is set from correct view value (it must be formatter - change comma to dot)
     */
    else {
      var dots = 0;
      var currentPosition = valBeforeCursor.length;
      if (isThousandSeparator) {
        parsedValue = addThousandSeparator(parsedValue, fractionSeparator,
          thousandSeparator);
        dots = countThousandSeparatorToPosition(parsedValue,
          thousandSeparator, currentPosition);
      }
      if (prepend) {
        dots++;
        if (new RegExp('^(\\-\\d)$').test(parsedValue)) {
          dots += 2;
        }
        if (new RegExp('^(\\d)$').test(parsedValue)) {
          dots++;
        }
      }
      changeViewValue(ngModelController, parsedValue, parameters, state);
      setCaretPosition(element[0], currentPosition + dots);
      return convViewToModel(parsedValue, fractionSeparator,
        thousandSeparator);
    }
  }

  function triggerParsers(ngModelController, value) {
    ngModelController.$setViewValue('');
    ngModelController.$render();
    ngModelController.$setViewValue(value);
    ngModelController.$render();
  }

  function onPropertyWatch(ngModelController, initObject) {
    var value = filterModelValue(
      ngModelController.$modelValue,
      initObject.fractionPart,
      initObject.fractionSeparator,
      initObject.roundFunction,
      initObject.isFixed,
      initObject.isThousandSeparator,
      initObject.thousandSeparator,
      initObject.prepend,
      initObject.append
    );
    triggerParsers(ngModelController, value);
  }

  function dynamicNumberDirective(dynamicNumberStrategy) {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        awnum: "@",
        numInt: "@",
        numFract: "@",
        numSep: "@",
        numPos: "@",
        numNeg: "@",
        numRound: "@",
        numThousand: "@",
        numThousandSep: "@",
        numPrepend: "@",
        numAppend: "@",
        numFixed: "@"
      },
      link: function(scope, element, attrs, ngModelController) {
        if (!element[0] || element[0].tagName !== 'INPUT' || (element[0].type !==
            'text' && element[0].type !== 'tel')) {
          console.warn(
            'Directive angular-dynamic-number works only for \'input\' tag with type = \'text\' or type = \'tel\''
          );
          return;
        }
        if (!ngModelController) {
          console.warn(
            'Directive angular-dynamic-number need ngModel attribute');
          return;
        }
        var initObject = initAllProperties(
          createPropertyObject(scope),
          element,
          attrs,
          ngModelController,
          dynamicNumberStrategy
        );

        element.on('paste', function() {
          wasPasted = true;
        });

        scope.$watch('numInt', function(newProperty, oldProperty) {
          if (oldProperty === newProperty) {
            return;
          }
          initObject = initAllProperties(createPropertyObject(scope,
              'numInt', newProperty), element, attrs,
            ngModelController, dynamicNumberStrategy);
          onPropertyWatch(ngModelController, initObject);
        });

        scope.$watch('numFract', function(newProperty, oldProperty) {
          if (oldProperty === newProperty) {
            return;
          }
          initObject = initAllProperties(createPropertyObject(scope,
              'numFract', newProperty), element, attrs,
            ngModelController, dynamicNumberStrategy);
          onPropertyWatch(ngModelController, initObject);
        });

        scope.$watch('numSep', function(newProperty, oldProperty) {
          if (oldProperty === newProperty) {
            return;
          }
          initObject = initAllProperties(createPropertyObject(scope,
              'numSep', newProperty), element, attrs,
            ngModelController, dynamicNumberStrategy);
          onPropertyWatch(ngModelController, initObject);
        });

        scope.$watch('numPos', function(newProperty, oldProperty) {
          if (oldProperty === newProperty) {
            return;
          }
          initObject = initAllProperties(createPropertyObject(scope,
              'numPos', newProperty), element, attrs,
            ngModelController, dynamicNumberStrategy);
          onPropertyWatch(ngModelController, initObject);
        });

        scope.$watch('numNeg', function(newProperty, oldProperty) {
          if (oldProperty === newProperty) {
            return;
          }
          initObject = initAllProperties(createPropertyObject(scope,
              'numNeg', newProperty), element, attrs,
            ngModelController, dynamicNumberStrategy);
          onPropertyWatch(ngModelController, initObject);
        });

        scope.$watch('numThousand', function(newProperty, oldProperty) {
          if (oldProperty === newProperty) {
            return;
          }
          initObject = initAllProperties(createPropertyObject(scope,
              'numThousand', newProperty), element, attrs,
            ngModelController, dynamicNumberStrategy);
          onPropertyWatch(ngModelController, initObject);
        });

        scope.$watch('numThousandSep', function(newProperty, oldProperty) {
          if (oldProperty === newProperty) {
            return;
          }
          initObject = initAllProperties(createPropertyObject(scope,
              'numThousandSep', newProperty), element, attrs,
            ngModelController, dynamicNumberStrategy);
          onPropertyWatch(ngModelController, initObject);
        });

        scope.$watch('numAppend', function(newProperty, oldProperty) {
          if (oldProperty === newProperty) {
            return;
          }
          initObject = initAllProperties(createPropertyObject(scope,
              'numAppend', newProperty), element, attrs,
            ngModelController, dynamicNumberStrategy);
          onPropertyWatch(ngModelController, initObject);
        });

        scope.$watch('numPrepend', function(newProperty, oldProperty) {
          if (oldProperty === newProperty) {
            return;
          }
          initObject = initAllProperties(createPropertyObject(scope,
              'numPrepend', newProperty), element, attrs,
            ngModelController, dynamicNumberStrategy);
          onPropertyWatch(ngModelController, initObject);
        });
        scope.$watch('numFixed', function(newProperty, oldProperty) {
          if (oldProperty === newProperty) {
            return;
          }
          initObject = initAllProperties(createPropertyObject(scope,
              'numFixed', newProperty), element, attrs,
            ngModelController, dynamicNumberStrategy);
          onPropertyWatch(ngModelController, initObject);
        });
        var state = {
          enable: true,
          count: 0
        };
        ngModelController.$parsers.unshift(function(value) {
          if (state.enable) {
            state.count++;
            return prepareResponse(directiveParser(value, initObject,
              state));
          } else {
            state.enable = true;
            return value;
          }
        });
        /**
         * it is like filter,
         */
        ngModelController.$formatters.push(function(value) {
          return filterModelValue(
            value,
            initObject.fractionPart,
            initObject.fractionSeparator,
            initObject.roundFunction,
            initObject.isFixed,
            initObject.isThousandSeparator,
            initObject.thousandSeparator,
            initObject.prepend,
            initObject.append
          );
        });
      }
    };
  }

  var moduleName = 'dynamicNumber';

  angular.module(moduleName, [])
    .provider('dynamicNumberStrategy', function() {
      var strategies = {};

      this.addStrategy = addStrategy;
      this.getStrategy = getStrategy;
      this.getStrategies = getStrategies;

      var strategyProvider = {
        addStrategy: addStrategy,
        getStrategy: getStrategy,
        getStrategies: getStrategies
      };

      this.$get = function() {
        return strategyProvider;
      };

      function addStrategy(name, strategy) {
        strategies[name] = strategy;
      }

      function getStrategy(name) {
        return strategies[name];
      }

      function getStrategies() {
        return strategies;
      }
    })
    .filter('awnum', ['dynamicNumberStrategy', function(
      dynamicNumberStrategy) {
      return function(value, numFract, numSep, numRound, numFixed,
        numThousand, numThousandSep, numPrepend, numAppend) {
        var strategy = {};
        var fractionPart;
        if (angular.isString(numFract)) {
          strategy = dynamicNumberStrategy.getStrategy(numFract);
          numFract = strategy.numFract;
        }
        var fractionPart = initFractionPart(numFract, 2);
        var fractionSeparator = initSeparator(numSep !== undefined ?
          numSep : strategy.numSep, '.');
        var roundFunction = initRound(numRound !== undefined ?
          numRound : strategy.numRound, Math.round);
        var isFixed = initIsFixed(numFixed !== undefined ? numFixed :
          strategy.numFixed, false);
        var isThousandSeparator = initIsThousand(numThousand !==
          undefined ? numThousand : strategy.numThousand, false);
        var thousandSeparator = initThousandSeparator(numThousandSep !==
          undefined ? numThousandSep : strategy.numThousandSep,
          fractionSeparator, fractionSeparator === '.' ? ',' : '.');
        var prepend = initNumAppendPrepend(numPrepend !== undefined ?
          numPrepend : strategy.numPrepend);
        var append = initNumAppendPrepend(numAppend !== undefined ?
          numAppend : strategy.numAppend);
        var filteredValue = filterModelValue(value, fractionPart,
          fractionSeparator, roundFunction, isFixed,
          isThousandSeparator, thousandSeparator, prepend, append);
        if (filteredValue === '') {
          return '0';
        }
        return filteredValue;
      };
    }])
    .directive('awnum', ['dynamicNumberStrategy', dynamicNumberDirective]);

  return moduleName;
}));
