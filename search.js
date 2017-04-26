const elasticsearch = require('elasticsearch');
const fs = require('fs');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

const inputPath = process.argv[2];
const outputPath = process.argv[2].split('.')[0] + '.output.json';
const errorOutputPath = process.argv[2].split('.')[0] + '.error.json';

const query = JSON.parse(fs.readFileSync(inputPath));



client.ping({
	requestTimeout: 1000
}, function (error) {
	if (error) {
		console.trace('elasticsearch cluster is down!');
	} else {
		console.log('All is well');
	}
});

client.search(query).then(function(result){
	fs.writeFileSync(outputPath, JSON.stringify(result, null, '\t'));
}, function(rejection){
	fs.writeFileSync(inputPath, JSON.stringify(rejection, null, '\t'));
});
