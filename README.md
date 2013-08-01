## Node Captcha

captcha generator for node.

## Installation

	$ npm install node-captcha

## Usage 

```javascript
var captcha = require('node-captcha');

captcha({},function(err, data){
  res.end(data);
});

```