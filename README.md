# Simpl-barChart

Tiny barChart in JavaScript for simple cases

## Usage
To create the bar chart, you need a block level container like a div or p.

```html
<div id="chart"></div>
```
Then you can create the BarChart object in your JavaScript file.

Sample usage: https://codepen.io/anon/pen/qxbZxo

```js
var barChart = new BarChart(options);

// options is an object contains chart data and settings:

var options = {
// required
	targetId: "chart",
	data: [
	    {label: 'Jan', value: 10},
	    {label: 'Feb', value: 11},
	    {label: 'March', value: 55},
	    {label: 'April', value: 89},
	    {label: 'May', value: 33}
		],
// non required
	width: 500,
	height: 500,

	axisColor: "#666",
	fontColor: "#666",
	guidelineColor: "#ddd",
	barColor: "random"
}

```
