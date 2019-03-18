const PageState = function() {
	let currentState = new homeState(this);

	this.init = function() {
		this.change(new homeState());
	};

	this.change = function(state) {
		currentState = state;
	};
};

// Home state
const homeState = function(page) {
	document.querySelector('#heading').textContent = null;
	document.querySelector('#content').innerHTML = `
    <div class="jumbotron">
      <h1 class="display-4">State Data</h1>
      <p class="lead">This site explores some basic data about the states.</p>
      <hr class="my-4">
      <p>Fell free to look at our interactive graphs or interactive maps</p>
		</div>
  `;
};

const graphState = function(page) {
	document.querySelector('#heading').textContent = 'Explore the Correlations';
	document.querySelector('#content').innerHTML = `
    <div class="container">
    	<div class="row">
      	<div class="col-xs-12 col-md-12">
        	<h1>D3Times</h1>
      	</div>
    	</div>
    	<div class="row">
      	<div class="col-xs-12  col-md-9 col-md-offset-1">
        	<div id="scatter">
        	</div>
      	</div>
    	</div>
		</div>
	`;
	drawScatter();
};

const mapState = function(property = 'poverty') {
	document.querySelector('#heading').textContent = 'See the differences';
	document.querySelector('#content').innerHTML = `
    <br>
    <a class="no-dec" id="poverty" href="#">Poverty</a> |
    <a class="no-dec" id="age" href="#">Age</a> |
    <a class="no-dec" id="income" href="#">Income</a> |
    <a class="no-dec" id="healthcare" href="#">Healthcare</a> |
    <a class="no-dec" id="obesity" href="#">Obesity</a> |
    <a class="no-dec" id="smokes" href="#">Smokes</a>
    <div id="tooltip"></div>
    <div class="container">
      <svg width="960" height="600" id="statesvg"></svg>
		</div>
	`;
	const poverty = document.getElementById('poverty');
	poverty.addEventListener('click', (e) => {
		page.change(new mapState('poverty'));
		e.preventDefault();
	});
	const age = document.getElementById('age');
	age.addEventListener('click', (e) => {
		page.change(new mapState('age'));
		e.preventDefault();
	});
	const income = document.getElementById('income');
	income.addEventListener('click', (e) => {
		page.change(new mapState('income'));
		e.preventDefault();
	});
	const healthcare = document.getElementById('healthcare');
	healthcare.addEventListener('click', (e) => {
		page.change(new mapState('healthcare'));
		e.preventDefault();
	});
	const obesity = document.getElementById('obesity');
	obesity.addEventListener('click', (e) => {
		page.change(new mapState('obesity'));
		e.preventDefault();
	});
	const smokes = document.getElementById('smokes');
	smokes.addEventListener('click', (e) => {
		page.change(new mapState('smokes'));
		e.preventDefault();
	});
	uStatesInit();
	drawMap(property);
};

// instantiate page state
const page = new PageState();

// init the first state
page.init();

// ui variables
const home = document.getElementById('home');
const graph = document.getElementById('graphs');
const usMap = document.getElementById('maps');

home.addEventListener('click', (e) => {
	page.change(new homeState());
	e.preventDefault();
});

graph.addEventListener('click', (e) => {
	page.change(new graphState());
	e.preventDefault();
});

usMap.addEventListener('click', (e) => {
	page.change(new mapState());
	e.preventDefault();
});

function drawMap(prop, stateSvg) {
	d3.csv('assets/data/data.csv').then((data) => {
		const property = prop;
		function tooltipHtml(n, d) {
			return `
	    <h4>${n}</h4>
	    <p>${property}: ${d[property]}</p>
	  `;
		}

		const value = data.map((d) => +d[property]);
		const maxVal = d3.max(value);
		const minVal = d3.min(value);
		const diff = maxVal - minVal;

		const abbr = data.map((d) => d.abbr);

		const filterState = (abbr, state) => {
			return abbr === state.abbr;
		};

		const sampleData = {};
		abbr.forEach((d) => {
			const state = data.filter((stateData) => filterState(d, stateData))[0];
			sampleData[d] = {
				n: state.state,
				poverty: state.poverty,
				age: state.age,
				income: state.income,
				healthcare: state.healthcare,
				obesity: state.obesity,
				smokes: state.smokes,
				color: d3.interpolateGreens((state[property] - minVal) / diff)
			};
		});

		uStates.draw('#statesvg', sampleData, tooltipHtml, minVal, maxVal);
	});
}
