[![npm](https://img.shields.io/npm/v/dragg.svg)](https://www.npmjs.com/package/dragg)

# Dragg
### Tiny library to make any element draggable.

## Usage
Pass the element you want to be draggable to the constructor:  
`const dragg = new Dragg(element, options)` 

To listen to the events, use `dragg.on(event)` (see the example below).

## Example
Your javascript file could look something like this:
```javascript
import Dragg from 'dragg'

var draggableElems = document.querySelectorAll('.js-draggable')
var draggables = []
for (var i = 0; i < draggableElems.length; i++) {
	const dragg = new Dragg(draggableElems[i], {
		classes: {
			dragging: 'box--dragging'
		}
	})
	draggables.push(dragg)
	dragg.on('start', (...args) => {
		console.log('start event:', args)
	})
	dragg.on('move', (...args) => {
		console.log('move event:', args)
	})
	dragg.on('change', (...args) => {
		console.log('change event:', args)
	})
	dragg.on('drop', (...args) => {
		console.log('drop event:', args)
	})
}
```

The 'dragging' class should have `position: fixed`, a high `z-index` and no `pointer-events`.

Your HTML file could look something like this:
```html
<style type="text/css" media="screen">
	.box {
		border: 1px solid black;
		padding: 1rem;
		display: inline-block;
	}
	.box--dragging {
		position: fixed;
		z-index: 1;
		transform: translateX(-50%) translateY(-50%);
		pointer-events: none;
	}
</style>

<body>
	<h1 id="one">Try dragging a box over this element and check the console</h1>
	<h1 id="two">Hello world</h1>
	<h1 id="three">Hello world 2</h1>

	<div class="js-draggable box">i'm draggable</div>
	<div class="js-draggable box">i'm also draggable</div>
	<div class="js-draggable box">me too</div>
	
	<script src="main.js" type="text/javascript" charset="utf-8"></script>
</body>
```
