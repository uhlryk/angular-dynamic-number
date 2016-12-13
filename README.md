# Angular Dynamic Number
[![Build Status](https://travis-ci.org/uhlryk/angular-dynamic-number.svg)](https://travis-ci.org/uhlryk/angular-dynamic-number)
[![Downloads](https://img.shields.io/npm/dt/angular-dynamic-number.svg)](https://www.npmjs.com/package/angular-dynamic-number)
[![Downloads](https://img.shields.io/npm/dm/angular-dynamic-number.svg)](https://www.npmjs.com/package/angular-dynamic-number)
[![NPM version](https://img.shields.io/npm/v/angular-dynamic-number.svg)](https://www.npmjs.com/package/angular-dynamic-number)
[![Bower](https://img.shields.io/bower/v/angular-dynamic-number.svg)](http://bower.io/search/?q=angular-dynamic-number)

Highly customizable AngularJS directive for numbers.
It validates inputs in realtime (if user press not acceptable character
it wont appear in input field). This directive may be configured for each input  (you can set number of digits in integer part and number of digits in decimal part, you can set decimal separator, accept only positive or negative values)

The Big advantage of this directive, is separation of view value and model value. You can set comma as decimal separator (default is dot) for numbers. And then in input field there will be comma as separator, but your model value will be correct float number with dot separator.

It works at realtime, therefore this model value may be use in computation for other elements and they will change real time too.

It works also when you set in controller your model value (with dot) and if you set separator as comma, then in input field there will be comma.

There is also filter for one directional binding (ngBind). It round fraction part to fixed number of digits. Round method can be select from
Math.round, Math.ceil and Math.floor. It can show comma or dot as decimal separator.

Filters can reuse strategies.

It even allow to dynamically change directive properties. Just set them as models. 

It is also React version available [React Dynamic Number](https://github.com/uhlryk/react-dynamic-number)

## Change Log:

### v2.0.0: 

model type is number instead of string. 

## Demo:
[link](http://htmlpreview.github.io/?https://github.com/uhlryk/angular-dynamic-number/blob/master/examples/index.html)

## Features:
- config max numbers for integer part and decimal part.
- config decimal separator (dot or comma)
- config to accept positive, negative and both numbers.
- model value is correct javascript number, but view value may be correct number for localities
- dynamic thousand separator (by default if decimal separator is comma then thousand separator is dot)
- thousand separarator: space, dot or comma
- filter with comma/dot separator and congurable number of fraction digits
- filter with thousand separator
- keeps cursor position
- custom strategies for directive and filer
- allow add currency (single character) 
- allow to dynamically change directive properties

## Limitations:
Directive is designed for input text/tel field ( **type="text"** and **type="tel"** ). Tel field type triggers numeric keyboard on mobile devices. The input field must have ngModel.

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

**num-fixed

If true then there is fixed number of fraction digets - (useful when fraction part is 00 and we need to show this zeros e.g. 12,00 )

**num-thousand**:

If true then number has thousand separator.

**num-thousand-sep**:

Set thousand separator (dot or comma or space or apostrophe) (enable if num-thousand = true, by default if num-sep equal dot then thousand separator is comma).
If you want to set separator as space remember that angular by default trim spaces. You can as value set "{{' '}}"

**num-prepend**

Allow to set single character prepend currency e.g. $1234.12. Html could have problem with show some characters. In those situations you should set currency as html entit.
€ = `&#x20AC;`

**num-append**

Allow to set single character append currency e.g. 1234.12€. Html could have problem with show some characters. In those situations you should set currency as html entit.
€ = `&#x20AC;`

## Dynamic properties

Some of properties of directive can be a models. And change in models change properties in directive. For example you can change currency, decimal separator etc.
Demo page has example of usage dynamic properties.

In short separator, integer, fraction, thousand, append are models

    <input type='text' class="form-control"
     ng-model='value'
     awnum
     num-sep="{{separator}}"
     num-int="{{integer}}"
     num-fract="{{fraction}}"
     num-thousand="{{thousand}}"
     num-append="{{append}}"
    >

Changes of some properties reset value in input (num-int, num-fract). Others properties after changes recreate value in input.

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

    {{ expression | awnum:numFrac:numSep:numRound:numFixed:numThousand:numThousandSep:numPrepend:numAppend}}

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

**numThousandSep**

Set thousand separator (dot or comma or space or apostrophe).

**numPrepend**

Allow to set single character prepend currency e.g. $1234.12. Html could have problem with show some characters. In those situations you should set currency as html entit.
€ = `&#x20AC;`

**numAppend**

Allow to set single character append currency e.g. 1234.12€. Html could have problem with show some characters. In those situations you should set currency as html entit.
€ = `&#x20AC;`

## Filter with strategies

    {{ expression | awnum:strategy}}

**strategy**

This is name of strategy

## ngTrim and spaces

This is angular input directive parameter. By default it has value true, which means that it automatically trim spaces and Angular Dynamic Number don't get spaces.
Therefore the best result is when you set for input ng-trim=false

## Example:
Negative number with max value 9999.99 and comma as separator

    <input type='text' ng-trim=false ng-model='value4' awnum num-sep=',' num-int=4 num-fract=2 num-pos=false>

Negative or positive number with max value 9999.99 and comma as separator and thousand separator space

    <input type='text' ng-trim=false ng-model='value4' awnum num-sep=',' num-int=4 num-fract=2 num-pos=false num-thousand=true num-thousand-sep="{{' '}}">
    
Filter for number with max 3 fraction number and comma separator

    <div>{{somemodel|awnum:3:',':'round'}}</div>

## License
MIT
