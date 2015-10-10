# Angular Dynamic Number [![Build Status](https://travis-ci.org/uhlryk/angular-dynamic-number.svg)](https://travis-ci.org/uhlryk/angular-dynamic-number)

Highly customizable AngularJS directive for numbers.
It validates inputs in realtime (if user press not acceptable character
it wont appear in input field). This directive in each input may be configured (you can set number of digits in integer part and number of digits in decimal part, you can set decimal separator, accept only positive or negative values)

The Big advantage of this directive, is separation of view value and model value. You can set comma as decimal separator (default is dot) for numbers. And then in input field there will be comma as separator, but your model value will be correct float number with dot separator.

It works at realtime, therefore this model value may be use in computation for other elements and they will change real time too.

It works also when you set in controller your model value (with dot) and if you set separator as comma, then in input field there will be comma.

## Demo: [demo](https://github.com/uhlryk/angular-dynamic-number/blob/master/examples/index.html)

## Features:
- config max numbers for integer part and decimal part.
- config decimal separator (dot or comma)
- config to accept positive, negative and both numbers.
- model value is correct javascript number, but view value may be correct number for localities
Edit contractors create new entry for contractor (old entries are for archive or for generate old invoices with old contractor data)
Delete contractors set entries as archive.
Add, list, show invoices
Generate pdf of invoice

## Limitations:
Directive is designed for an input text field. The input field must have ngModel.

## Installation:
### npm
### bower:
### manualy
## License
MIT