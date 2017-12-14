// Simpl-barChart by Max
// v1.0.0

"use strict";

function BarChart(options) {
	var chart = this;
	chart.id = options.targetId;
	chart.data = options.data;
	chart.width = options.width || 500;
	chart.height = options.height || 500;
	chart.axisColor = options.axisColor || "#666";
	chart.fontColor = options.fontColor || "#666";
	chart.guidelineColor = options.guidelineColor || "#ddd";
	chart.barColor = options.barColor || "random";

	chart.axisWidth = 1;
	chart.guidelineWidth = 0.5;
	chart.fontFamily = "times";
	chart.fontStyle = "normal";
	chart.fontWeight = "300";

	chart.initChart();
	chart.drawChart();
}

BarChart.prototype.initChart = function () {
	var chart = this;
	chart.vMargin = Math.ceil(chart.width / 200);
	chart.hMargin = Math.ceil(chart.height / 100);
	chart.fontSize = Math.ceil(chart.height * 0.05); // 5%

	chart.itemsNum = chart.data.length;
	chart.maxValue = Math.max.apply(null, chart.data.map(function (item) { return item.value }));
	chart.vLabelSize = chart.fontSize * ((chart.maxValue > 9999) ? 5 : (chart.maxValue > 999) ? 4 : (chart.maxValue > 99) ? 3 : 2)
	chart.vAxisSize = chart.height - chart.hMargin * 3 - chart.fontSize;
	chart.hAxisSize = chart.width - chart.hMargin * 3 - chart.vLabelSize;

	chart.Ox = chart.vMargin * 2 + chart.vLabelSize;
	chart.Oy = chart.hMargin + chart.vAxisSize;
	chart.vScaleStep = Math.ceil(chart.maxValue / 10) || 1;
	chart.vScale = (chart.vAxisSize - chart.fontSize) / (chart.vScaleStep * 10);
	var size = Math.floor(chart.hAxisSize / chart.itemsNum);
	chart.barMargin = Math.floor((size * 10) / 100) + 1;
	chart.barSize = size - chart.barMargin;
};

BarChart.prototype.drawChart = function () {
	var chart = this;
	chart.createCanvas();
	chart.drawVerticalLabels();
	chart.drawHorizontalLabels();
	chart.drawHorizontalGuidelines();
	chart.drawBars();
	chart.drawAxis();
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

	var step = Math.floor((chart.vAxisSize - chart.fontSize) / 10);
	var labelX = chart.vLabelSize;
	var labelText = 0;
	var labelY = chart.Oy;
	for (var i = 0; i <= 10; i++) {
		chart.context.fillText(labelText, labelX, labelY);
		labelText += chart.vScaleStep;
		labelY -= step;
	}
};

BarChart.prototype.drawHorizontalLabels = function () {
	var chart = this;

	var labelFont = chart.fontStyle + " " + chart.fontWeight + " " + chart.fontSize + "px " + chart.fontFamily;
	chart.context.textAlign = "center";
	chart.context.textBaseline = "top";
	// font & fillStyle already set

	var labelY = chart.Oy + chart.hMargin;
	for (var i = 0; i < chart.itemsNum; i++) {
		var labelX = chart.Ox + (i + 1) * chart.barMargin + i * chart.barSize + chart.barSize / 2;
		chart.context.fillText(chart.data[i].label, labelX, labelY);
	}
};

BarChart.prototype.drawHorizontalGuidelines = function () {
	var chart = this;
	chart.context.strokeStyle = chart.guidelineColor;
	chart.context.lineWidth = chart.guidelineWidth;

	var guidelineStartX = chart.Ox;
	var guidelineEndX = chart.width - chart.vMargin;
	var step = Math.floor((chart.vAxisSize - chart.fontSize) / 10);
	for (var i = 1; i <= 10; i++) {
		var guidelineY = chart.Oy - i * step - 0.5;
		chart.context.beginPath();
		chart.context.moveTo(guidelineStartX, guidelineY);
		chart.context.lineTo(guidelineEndX, guidelineY);
		chart.context.stroke();
	}
};

BarChart.prototype.drawBars = function () {
	var chart = this;

	var barX = chart.Ox + chart.barMargin;
	var fillColor = chart.barColor;
	var borderColor = chart.barColor;
	chart.context.fillStyle = fillColor;
	chart.context.strokeStyle = borderColor;
	for (var i = 0; i < chart.itemsNum; i++) {
		var barHeight = chart.data[i].value * chart.vScale;
		var barY = chart.Oy - barHeight;

		if (chart.barColor == "random") {
			var rndc = "rgba(" + rnd() + ", " + rnd() + ", " + rnd();
			fillColor = rndc + ", 0.5)";
			borderColor = rndc + ", 1)";
			chart.context.fillStyle = fillColor;
			chart.context.strokeStyle = borderColor;
		}

		chart.context.beginPath();
		chart.context.rect(barX, barY, chart.barSize, barHeight);
		chart.context.stroke();
		chart.context.fill();
		barX += chart.barMargin + chart.barSize;
	}
};

function rnd() { return Math.floor(Math.random() * 255); }
