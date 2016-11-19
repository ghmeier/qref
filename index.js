const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const userHelper = require('./lib/user-helper.js');

const app = express();
const corsOptions = {
	origin: '*'
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
	next();
});

app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));

app.get('/', (request, response) => {
	response.json({});
});

// user access
app.get('/:id', userHelper.folders);
app.get('/:id/:folder', userHelper.links);
app.get('/:id/:folder/a', userHelper.add);

app.listen(app.get('port'), () => {
	console.log('Node app is running on port', app.get('port'));
});
