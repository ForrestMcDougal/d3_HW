function drawScatter() {
	let width = parseInt(d3.select('#scatter').style('width'));
	let height = width - width / 3.9;
	let margin = 10;
	let labelArea = 200;
	let tPadBot = 140;
	let tPadLeft = 60;

	let svg = d3.select('#scatter').append('svg').attr('width', width).attr('height', height).attr('class', 'chart');

	let circRadius;
	function crGet() {
		circRadius = width <= 530 ? 5 : 10;
	}
	crGet();

	svg.append('g').attr('class', 'xText');
	let xText = d3.select('.xText');

	function xTextRefresh() {
		xText.attr(
			'transform',
			'translate(' + ((width - labelArea) / 2 + labelArea) + ', ' + (height - margin - tPadBot) + ')'
		);
	}
	xTextRefresh();

	xText
		.append('text')
		.attr('y', -20)
		.attr('data-name', 'poverty')
		.attr('data-axis', 'x')
		.attr('class', 'aText active x')
		.text('In Poverty (%)');
	xText
		.append('text')
		.attr('y', 0)
		.attr('data-name', 'age')
		.attr('data-axis', 'x')
		.attr('class', 'aText inactive x')
		.text('Age (Median)');
	xText
		.append('text')
		.attr('y', 20)
		.attr('data-name', 'income')
		.attr('data-axis', 'x')
		.attr('class', 'aText inactive x')
		.text('Household Income (Median)');
	xText
		.append('text')
		.attr('y', 40)
		.attr('data-name', 'healthcare')
		.attr('data-axis', 'x')
		.attr('class', 'aText inactive x')
		.text('Lacks Healthcare (%)');
	xText
		.append('text')
		.attr('y', 60)
		.attr('data-name', 'obesity')
		.attr('data-axis', 'x')
		.attr('class', 'aText inactive x')
		.text('Obese (%)');
	xText
		.append('text')
		.attr('y', 80)
		.attr('data-name', 'smokes')
		.attr('data-axis', 'x')
		.attr('class', 'aText inactive x')
		.text('Smokes (%)');

	let leftTextX = margin + tPadLeft;
	let leftTextY = (height + labelArea) / 2 - labelArea;

	svg.append('g').attr('class', 'yText');
	let yText = d3.select('.yText');

	function yTextRefresh() {
		yText.attr('transform', 'translate(' + leftTextX + ', ' + leftTextY + ')rotate(-90)');
	}
	yTextRefresh();

	yText
		.append('text')
		.attr('y', -20)
		.attr('data-name', 'poverty')
		.attr('data-axis', 'y')
		.attr('class', 'aText inactive y')
		.text('In Poverty (%)');
	yText
		.append('text')
		.attr('y', 0)
		.attr('data-name', 'age')
		.attr('data-axis', 'y')
		.attr('class', 'aText inactive y')
		.text('Age (Median)');
	yText
		.append('text')
		.attr('y', 20)
		.attr('data-name', 'income')
		.attr('data-axis', 'y')
		.attr('class', 'aText inactive y')
		.text('Household Income (Median)');
	yText
		.append('text')
		.attr('y', 40)
		.attr('data-name', 'healthcare')
		.attr('data-axis', 'y')
		.attr('class', 'aText inactive y')
		.text('Lacks Healthcare (%)');
	yText
		.append('text')
		.attr('y', 60)
		.attr('data-name', 'obesity')
		.attr('data-axis', 'y')
		.attr('class', 'aText active y')
		.text('Obese (%)');
	yText
		.append('text')
		.attr('y', 80)
		.attr('data-name', 'smokes')
		.attr('data-axis', 'y')
		.attr('class', 'aText inactive y')
		.text('Smokes (%)');

	d3.csv('assets/data/data.csv').then((data) => visualize(data));

	function visualize(theData) {
		let curX = 'poverty';
		let curY = 'obesity';

		let xMin;
		let xMax;
		let yMin;
		let yMax;

		let toolTip = d3.tip().attr('class', 'd3-tip').offset([ 40, -60 ]).html((d) => {
			let theX;
			let theState = `<div>${d.state}</div>`;
			let theY = `<div>${curY}: ${d[curY]}%</div>`;
			if (curX === 'poverty') {
				theX = `<div>${curX}: ${d[curX]}$</div>`;
			} else {
				theX = `<div>${curX}: ${parseFloat(d[curX]).toLocaleString('en')}</div>`;
			}
			return theState + theX + theY;
		});
		svg.call(toolTip);

		function xMinMax() {
			xMin = d3.min(theData, (d) => parseFloat(d[curX]) * 0.9);
			xMax = d3.max(theData, (d) => parseFloat(d[curX]) * 1.1);
		}

		function yMinMax() {
			yMin = d3.min(theData, (d) => parseFloat(d[curY]) * 0.9);
			yMax = d3.max(theData, (d) => parseFloat(d[curY]) * 1.1);
		}

		function labelChange(axis, clickedText) {
			d3
				.selectAll('.aText')
				.filter('.' + axis)
				.filter('.active')
				.classed('active', false)
				.classed('inactive', true);

			clickedText.classed('inactive', false).classed('active', true);
		}

		xMinMax();
		yMinMax();

		let xScale = d3.scaleLinear().domain([ xMin, xMax ]).range([ margin + labelArea, width - margin ]);
		let yScale = d3.scaleLinear().domain([ yMin, yMax ]).range([ height - margin - labelArea, margin ]);

		let xAxis = d3.axisBottom(xScale);
		let yAxis = d3.axisLeft(yScale);

		function tickCount() {
			if (width <= 500) {
				xAxis.ticks(5);
				yAxis.ticks(5);
			} else {
				xAxis.ticks(10);
				yAxis.ticks(10);
			}
		}
		tickCount();

		svg
			.append('g')
			.call(xAxis)
			.attr('class', 'xAxis')
			.attr('transform', `translate(0, ${height - margin - labelArea})`);
		svg.append('g').call(yAxis).attr('class', 'yAxis').attr('transform', `translate(${margin + labelArea}, 0)`);

		let theCircles = svg.selectAll('g theCircles').data(theData).enter();

		theCircles
			.append('circle')
			.attr('cx', (d) => xScale(d[curX]))
			.attr('cy', (d) => yScale(d[curY]))
			.attr('r', circRadius)
			.attr('class', (d) => `stateCircle ${d.abbr}`)
			.on('mouseover', function(d) {
				toolTip.show(d, this);
				d3.select(this).style('stroke', '#323232');
			})
			.on('mouseout', function(d) {
				toolTip.hide(d);
				d3.select(this).style('stroke', '#e3e3e3');
			});

		theCircles
			.append('text')
			.text((d) => d.abbr)
			.attr('dx', (d) => xScale(d[curX]))
			.attr('dy', (d) => yScale(d[curY]) + circRadius / 2.5)
			.attr('font-size', circRadius)
			.attr('class', 'stateText')
			.on('mouseover', (d) => {
				toolTip.show(d);
				d3.select(`.${d.abbr}`).style('stroke', '#323232');
			})
			.on('mouseout', (d) => {
				toolTip.hide(d);
				d3.select(`.${d.abbr}`).style('stroke', '#e3e3e3');
			});

		d3.selectAll('.aText').on('click', function() {
			let self = d3.select(this);
			if (self.classed('inactive')) {
				let axis = self.attr('data-axis');
				let name = self.attr('data-name');
				if (axis === 'x') {
					curX = name;
					xMinMax();
					xScale.domain([ xMin, xMax ]);
					svg.select('.xAxis').transition().duration(300).call(xAxis);
					d3.selectAll('circle').each(function() {
						d3
							.select(this)
							.transition()
							.attr('cx', function(d) {
								return xScale(d[curX]);
							})
							.duration(300);
					});
					d3.selectAll('.stateText').each(function() {
						d3
							.select(this)
							.transition()
							.attr('dx', function(d) {
								return xScale(d[curX]);
							})
							.duration(300);
					});
					labelChange(axis, self);
				} else {
					curY = name;
					yMinMax();
					yScale.domain([ yMin, yMax ]);
					svg.select('.yAxis').transition().duration(300).call(yAxis);
					d3.selectAll('circle').each(function() {
						d3.select(this).transition().attr('cy', (d) => yScale(d[curY])).duration(300);
					});
					d3.selectAll('.stateText').each(function() {
						d3.select(this).transition().attr('dy', (d) => yScale(d[curY]) + circRadius / 3).duration(300);
					});
					labelChange(axis, self);
				}
			}
		});

		d3.select(window).on('resize', resize);

		function resize() {
			width = parseInt(d3.select('#scatter').style('width'));
			height = width - width / 3.9;
			leftTextY = (height + labelArea) / 2 - labelArea;

			svg.attr('width', width).attr('height', height);

			xScale.range([ margin + labelArea, width - margin ]);
			yScale.range([ height - margin - labelArea, margin ]);

			svg.select('.xAxis').call(xAxis).attr('transform', `translate(0, ${height - margin - labelArea})`);

			svg.select('.yAxis').call(yAxis);

			tickCount();

			xTextRefresh();
			yTextRefresh();

			crGet();

			d3
				.selectAll('circle')
				.attr('cy', (d) => yScale(d[curY]))
				.attr('cx', (d) => xScale(d[curX]))
				.attr('r', circRadius);

			d3
				.selectAll('.stateText')
				.attr('dy', (d) => yScale(d[curY]) + circRadius / 3)
				.attr('dx', (d) => xScale(d[curX]))
				.attr('r', circRadius / 3);
		}
	}
}
