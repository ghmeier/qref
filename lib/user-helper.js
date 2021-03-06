/* User Helpers */
const mongo = require('./mongo-helper.js');

module.exports.folders = (req, response) => {
	const id = req.params.id.toLowerCase();
	mongo.getUser(id, user => {
		if (!user) {
			response.json({message: 'user not found'});
			return;
		}

		response.json({
			data: Object.keys(user.folders)
		});
		return;
	});
};

module.exports.links = (req, response) => {
	const id = req.params.id.toLowerCase();
	const folder = req.params.folder.toLowerCase();

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
	const id = req.params.id.toLowerCase();
	const folder = req.params.folder.toLowerCase();
	const link = req.query.l;
	if (link === '') {
		response.json({message: 'must provide a l query parameter'});
		return;
	}

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

			response.json({data: user.folders[folder]});
		});
	});
};
