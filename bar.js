// Simpl-barChart by Max

"use strict";

function BarChart(options) {
	var chart = this;

	chart.id = options.targetId;
	chart.width = options.width || 500;
	chart.height = options.height || 500;
	chart.data = options.data;
	chart.axisColor = options.axisColor || "#666";
	chart.fontColor = options.fontColor || "#666";
	chart.guidelineColor = options.guidelineColor || "#ddd";
	chart.barColor = options.barColor || "random";

	chart.axisWidth = 1;
	chart.guidelineWidth = 0.5;
	chart.fontFamily = "times";
	chart.fontStyle = "normal";
	chart.fontWeight = "300";

	chart.labels = [];
	chart.values = [];

	chart.initChart();
	chart.createCanvas();
	chart.drawChart();
}

BarChart.prototype.initChart = function () {
	var chart = this;

	chart.data.forEach(function (item) {
		chart.labels.push(item.label);
		chart.values.push(item.value);
	});

	chart.vMargin = Math.ceil(chart.width / 100);
	chart.hMargin = Math.ceil(chart.height / 100);
	chart.fontSize = Math.ceil(chart.height * 0.03); // 3%

	chart.itemsNum = chart.data.length;
	chart.maxValue = Math.max.apply(null, chart.values);
	chart.vLabelSize = chart.fontSize * ((chart.maxValue > 1000) ? 5 : (chart.maxValue > 100) ? 4 : (chart.maxValue > 10) ? 3 : 2)
	chart.vAxisSize = chart.height - chart.hMargin * 3 - chart.fontSize;
	chart.hAxisSize = chart.width - chart.hMargin * 3 - chart.vLabelSize;

	chart.Ox = chart.vMargin * 2 + chart.vLabelSize;
	chart.Oy = chart.hMargin + chart.vAxisSize;
	chart.vScaleMax = Math.ceil((chart.maxValue / 10) || 1) * 10;
	chart.vScaleStep = chart.vScaleMax / 10;
	chart.vScale = Math.floor((chart.vAxisSize - chart.fontSize) / chart.vScaleMax);
	var size = Math.floor(chart.hAxisSize / chart.itemsNum);
	chart.barMargin = Math.floor((size * 10) / 100) + 1;
	chart.barSize = size - chart.barMargin;
};

BarChart.prototype.createCanvas = function () {
	var chart = this;
	var canvas = document.createElement("canvas");
	canvas.id = chart.id + "-" + Math.random();
	canvas.width = chart.width;
	canvas.height = chart.height;

	document.getElementById(chart.id).innerHTML = "";
	document.getElementById(chart.id).appendChild(canvas);

	chart.context = canvas.getContext("2d");
};

BarChart.prototype.drawChart = function () {
	var chart = this;
	chart.drawVerticalLabels();
	chart.drawHorizontalLabels();
	chart.drawHorizontalGuidelines();
	chart.drawBars();
	chart.drawAxis();
};

BarChart.prototype.drawAxis = function () {
	var chart = this;
	// Vertical
	chart.context.beginPath();
	chart.context.strokeStyle = chart.axisColor;
	chart.context.lineWidth = chart.axisWidth;
	chart.context.moveTo(chart.Ox, chart.hMargin);
	chart.context.lineTo(chart.Ox, chart.Oy);
	chart.context.stroke();
	// Horizontal
	chart.context.beginPath();
	chart.context.moveTo(chart.Ox, chart.Oy);
	chart.context.lineTo(chart.Ox + chart.hAxisSize, chart.Oy);
	chart.context.stroke();
};

BarChart.prototype.drawVerticalLabels = function () {
	var chart = this;

	chart.context.font = chart.fontStyle + " " + chart.fontWeight + " " + chart.fontSize + "px " + chart.fontFamily;
	chart.context.textAlign = "right";
	chart.context.fillStyle = chart.fontColor;

	// Draw labels
	var step = Math.floor((chart.vAxisSize - chart.fontSize) / 10);
	for (var i = 0; i <= 10; i++) {
		var labelText = i * chart.vScaleStep;
		var labelX = chart.vLabelSize;
		var labelY = chart.Oy - i * step;

		chart.context.fillText(labelText, labelX, labelY);
	}
};

BarChart.prototype.drawHorizontalLabels = function () {
	var chart = this;

	var labelFont = chart.fontStyle + " " + chart.fontWeight + " " + chart.fontSize + "px " + chart.fontFamily;
	chart.context.font = labelFont;
	chart.context.textAlign = "center";
	chart.context.textBaseline = "top";
	chart.context.fillStyle = chart.fontColor;

	// Draw Labels
	for (var i = 0; i < chart.itemsNum; i++) {
		var horizontalLabelX = chart.Ox + (i + 1) * chart.barMargin + i * chart.barSize + chart.barSize / 2;
		var horizontalLabelY = chart.Oy + chart.hMargin;

		chart.context.fillText(chart.labels[i], horizontalLabelX, horizontalLabelY);
	}
};

BarChart.prototype.drawHorizontalGuidelines = function () {
	var chart = this;
	chart.context.strokeStyle = chart.guidelineColor;
	chart.context.lineWidth = chart.guidelineWidth;

	// Draw lines
	var step = Math.floor((chart.vAxisSize - chart.fontSize) / 10);
	for (var i = 1; i <= chart.itemsNum; i++) {
		// Starting point coordinates
		var horizontalGuidelineStartX = chart.Ox;
		var horizontalGuidelineStartY = chart.Oy - i * step;

		// End point coordinates
		var horizontalGuidelineEndX = chart.width - chart.vMargin;
		var horizontalGuidelineEndY = chart.Oy - i * step;

		chart.context.beginPath();
		chart.context.moveTo(horizontalGuidelineStartX, horizontalGuidelineStartY);
		chart.context.lineTo(horizontalGuidelineEndX, horizontalGuidelineEndY);
		chart.context.stroke();
	}
};

BarChart.prototype.drawBars = function () {
	var chart = this;

	for (var i = 0; i < chart.itemsNum; i++) {
		var color = chart.createRandomRGBColor();
		var fillColor = (chart.barColor == "random") ? "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.5)" : chart.barColor;
		var borderColor = (chart.barColor == "random") ? "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 1)" : chart.barColor;

		chart.context.beginPath();

		var barX = chart.Ox + (i + 1) * chart.barMargin + i * chart.barSize;
		var barY = chart.Oy - chart.values[i] * chart.vScale;
		var barWidth = chart.barSize;
		var barHeight = chart.values[i] * chart.vScale;

		chart.context.fillStyle = fillColor;
		chart.context.strokeStyle = borderColor;
		chart.context.rect(barX, barY, barWidth, barHeight);
		chart.context.stroke();
		chart.context.fill();
	}
};

BarChart.prototype.createRandomRGBColor = function () {
	var red = getRandomInt(0, 257);
	var green = getRandomInt(0, 257);
	var blue = getRandomInt(0, 257);
	return { r: red, g: green, b: blue };
};

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
