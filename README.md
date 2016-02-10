reddit-flux
===========
A mobile HTML client for Reddit

# Build instructions

```
npm install --production --loglevel info

# Removes "use strict"
rm -rfv node_modules/babel-preset-es2015/node_modules/babel-plugin-transform-es2015-modules-commonjs/

# Now, remove the line containing "babel-plugin-transform-es2015-modules-commonjs" from node_modules/babel-preset-es2015/index.js

# Transpile from Jade and ES7 JS to HTML and ES5 JS
npm run make-html
npm run make-js
```

# Usage

Open `index.html` in a browser.