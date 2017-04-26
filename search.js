const elasticsearch = require('elasticsearch');
const fs = require('fs');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

const inputPath = process.argv[2];
const outputPath = inputPath.split('.')[0] + '.output.json';
const errorOutputPath = inputPath.split('.')[0] + '.error.json';

const query = JSON.parse(fs.readFileSync(inputPath));

client.ping({
	requestTimeout: 1000
}, function (error) {
	if (error) {
		console.trace('elasticsearch cluster is down!');
		process.exit();
	} else {
		console.log('All is well');
	}
});

client.search(query).then(function(result){
	try {
		fs.writeFileSync( outputPath, "JSON.stringify(result, null, '\t')");
	} catch (err) {
		console.trace('Error writing ' + outputPath + ': ' + err.message);
	}
}, function(rejection){
	fs.writeFileSync(errorOutputPath, JSON.stringify(rejection, null, '\t'));
});
