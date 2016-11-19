/* User Helpers */
const mongo = require('./mongo-helper.js');

module.exports.folders = (req, response) => {
	const id = req.query.id;
	mongo.getUser(id, user => {
		response.json({
			data: Object.keys(user.folders)
		});
		return;
	});
};

module.exports.links = (req, response) => {
	const id = req.params.id;
	const folder = req.params.folder;

	mongo.getUser(id, user => {
		if (!user) {
			response.json({
				data: null,
				error: 'NOT AVAILABLE'
			});
			return;
		}

		response.json({
			data: user.folders[folder]
		});
	});
};

module.exports.add = (req, response) => {
	const id = req.params.id;
	const folder = req.params.folder;
	const link = req.query.l;

	mongo.getUser(id, user => {
		if (!user) {
			user = {name: id, folders: {}};
		}

		if (!user.folders[folder]) {
			user.folders[folder] = [];
		}

		user.folders[folder].push(link);
		mongo.putUser(id, user, err => {
			if (err) {
				response.json({error: err, message: 'unable to add link'});
				return;
			}

			response.json({});
		});
	});
};
