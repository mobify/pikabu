bouncefix.js [![Build Status](https://travis-ci.org/jaridmargolin/bouncefix.js.png)](https://travis-ci.org/jaridmargolin/bouncefix.js)
============

```
   __                          ____          _   
  / /  ___  __ _____  _______ / _(_)_ __    (_)__
 / _ \/ _ \/ // / _ \/ __/ -_) _/ /\ \ /   / (_-<
/_.__/\___/\_,_/_//_/\__/\__/_//_//_\_(_)_/ /___/
                                       |___/     
```
                                              
Stop full body elastic scroll bounce when scrolling inside nested containers (IOS)

---

## Demos/Examples

**This is an IOS specific library. Demo using your IOS device.**

[Demo - With Fix](http://jaridmargolin.github.io/bouncefix.js/demo-with.html)

[Demo - Without Fix](http://jaridmargolin.github.io/bouncefix.js/demo-without.html)

---

## Why?

IOS (since IOS 5) offers native touch scrolling within nested containers via `-webkit-overflow-scrolling: touch;`, however, if scrolling occurs at one of the extremes, top or bottom, the elastic bounce occurs on the page rather than the nested container. `bouncefix.js` offers a viable solution to fix this issue.

**note:** If there is no content to scroll, scrolling is blocked on the container. This may cause issues if attempting to implement a scroll to refresh feature. This can be overcome creating a wrapper inside of your container and setting the height to 100% with a top and bottom padding of 1px (Not perfect, hackish, but it works)

---

## Install


```
npm install bouncefix.js
```

```
bower install bouncefix.js
```

---

## API

Methods should not be called until the DOM is ready.

### bouncefix.add(className);

Apply fix on all elements matching the specified className.

##### PARAMETERS:

* **\*className**: Elements to apply fix to.


##### EXAMPLE USAGE:

```
bouncefix.add('srcollable');
```

   
### bouncefix.remove(className);

Remove fix from all elements matching the specified className.

##### PARAMETERS:

* **\*className**: Elements to remove fix from.


##### EXAMPLE USAGE:

```
bouncefix.remove('srcollable');
```

---

## TESTS

**Install Dependencies**

```
npm install
```

```
bower install
```

**Run/View**

```
grunt test
```

---

## License

The MIT License (MIT) Copyright (c) 2014 Jarid Margolin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.