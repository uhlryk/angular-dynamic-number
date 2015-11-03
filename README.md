# Angular Dynamic Number [![Build Status](https://travis-ci.org/uhlryk/angular-dynamic-number.svg)](https://travis-ci.org/uhlryk/angular-dynamic-number)

Highly customizable AngularJS directive for numbers.
It validates inputs in realtime (if user press not acceptable character
it wont appear in input field). This directive may be configured for each input  (you can set number of digits in integer part and number of digits in decimal part, you can set decimal separator, accept only positive or negative values)

The Big advantage of this directive, is separation of view value and model value. You can set comma as decimal separator (default is dot) for numbers. And then in input field there will be comma as separator, but your model value will be correct float number with dot separator.

It works at realtime, therefore this model value may be use in computation for other elements and they will change real time too.

It works also when you set in controller your model value (with dot) and if you set separator as comma, then in input field there will be comma.

There is also filter for one directional binding (ngBind). It round fraction part to fixed number of digits. Round method can be select from
Math.round, Math.ceil and Math.floor. It can show comma or dot as decimal separator.

## Demo:
[link](http://htmlpreview.github.io/?https://github.com/uhlryk/angular-dynamic-number/blob/master/examples/index.html)

## Features:
- config max numbers for integer part and decimal part.
- config decimal separator (dot or comma)
- config to accept positive, negative and both numbers.
- model value is correct javascript number, but view value may be correct number for localities
- dynamic thousand separator (if decimal separator is comma then thousand separator is dot)
- filter with comma/dot separator and congurable number of fraction digits
- filter with thousand separator
- keeps cursor position
- custom strategies

## Limitations:
Directive is designed for an input text field. The input field must have ngModel.

## Installation:
### npm
    npm install angular-dynamic-number
### bower:
    bower install angular-dynamic-number
then reference:

    bower_components/angular-dynamic-number/release/dynamic-number.js

or

    bower_components/angular-dynamic-number/release/dynamic-number.min.js
### manualy
Clone repository ```https://github.com/uhlryk/angular-dynamic-number.git``` and use in your code ```release/dynamic-number.js```
## Quick start: How to use it
Add the js file to your html:

    <script src="myPath/angular-dynamic-number/release/dynamic-number.min.js"></script>
Or if you use browserify and install by npm:

    require('angular-dynamic-number');
Add the module to your dependencies:

    angular.module('myApp', ['dynamicNumber', ...])

Add the ```awnum``` attribute to input fields:

    <input type='text' ng-model='somemodel' awnum />

## Options
Options are also input field attributes

**num-int**:

Set maximum numbers of digits integer part (digits before decimal separator) (default 6).

**num-fract**:

Set maximum numbers of digits fraction part (digits after decimal separator) (default 2).

**num-sep**:

Set decimal separator (dot or comma) (default '.').

**num-pos**:

If true then number can be positive (default 'true').

**num-neg**:

If true then number can be negative (default 'true').

**num-round**:

Define round method for fraction part when convert from model to view and for filter

**num-thousand**:

If true then number has thousand separator.

## Custom strategies

There are multiple options for configuration each input. If you don't like write each time same options, there is for you custom strategies.
You can in config file create multiple sets of configs, and use them in input file

To create custom strategy in config use ```dynamicNumberStrategyProvider```. It has methods:

    addStrategy(strategyName, {
        numInt: number,
        numFract: number,
        numSep: char [\.|,],
        numPos: boolean [true|false],
        numNeg: boolean [true|false],
        numRound: string ['round' | 'ceil' | 'floor'],
        numThousand: boolean [true|false]
    })

for example, create price strategy:

    app.config(['dynamicNumberStrategyProvider', function(dynamicNumberStrategyProvider){
      dynamicNumberStrategyProvider.addStrategy('price', {
        numInt: 6,
        numFract: 2,
        numSep: '.',
        numPos: true,
        numNeg: true,
        numRound: 'round',
        numThousand: true
      });
    }]);

and use it in input:

    <input type="text" ng-model="somemodel" awnum="price">

## Filter options

    {{ expression | awnum:numFrac:numSep:numRound:numFixed:numThousand}}

**numFrac**

Set maximum numbers of digits fraction part (digits after decimal separator) (default 2).

**numSep**

Set decimal separator (dot or comma) (default '.').

**numRound**

Define round method for fraction part when convert from model to view and for filter

**numFixed**

If true then there is fixed number of fraction digets - (useful when fraction part is 00 and we need to show this zeros e.g. 12,00 )

**numThousand**

If true then number has thousand separator.

## Example:
Negative number with max value 9999.99 and comma as separator

    <input type='text' ng-model='value4' awnum num-sep=',' num-int=4 num-fract=2 num-pos=false>

Filter for number with max 3 fraction number and comma separator

    <div>{{somemodel|awnum:3:',':'round'}}</div>

## License
MIT