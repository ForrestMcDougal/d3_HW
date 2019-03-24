function pearsonCorrelation(independent, dependent) {
	let independent_mean = arithmeticMean(independent);
	let dependent_mean = arithmeticMean(dependent);
	let products_mean = meanOfProducts(independent, dependent);
	let covariance = products_mean - independent_mean * dependent_mean;

	let independent_standard_deviation = standardDeviation(independent);

	let dependent_standard_deviation = standardDeviation(dependent);

	let rho = covariance / (independent_standard_deviation * dependent_standard_deviation);

	return rho;
}

function arithmeticMean(data) {
	let total = 0;

	for (let i = 0, l = data.length; i < l; total += data[i], i++);

	return total / data.length;
}

function meanOfProducts(data1, data2) {
	let total = 0;

	for (let i = 0, l = data1.length; i < l; total += data1[i] * data2[i], i++);

	return total / data1.length;
}

function standardDeviation(data) {
	let squares = [];

	for (let i = 0, l = data.length; i < l; i++) {
		squares[i] = Math.pow(data[i], 2);
	}

	let mean_of_squares = arithmeticMean(squares);
	let mean = arithmeticMean(data);
	let square_of_mean = Math.pow(mean, 2);
	let variance = mean_of_squares - square_of_mean;
	let std_dev = Math.sqrt(variance);

	return std_dev;
}
