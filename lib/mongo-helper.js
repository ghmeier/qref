const MongoClient = require('mongodb').MongoClient;

const mongoUrl = process.env.MONGODB_URI;

/*  Keeps a global db connection around so we
	don't have to go searching for a new one every
	time. All mongo calls should be wrapped with
	mongoConnect((db) => {}) */
class MongoHelper {
	constructor() {
		this.gDb = null;
	}

	mongoConnect(cb) {
		if (this.gDb) {
			cb(this.gDb);
			return;
		}
		if (!mongoUrl) {
			console.log('ERROR: mongoUrl is undefined');
			return;
		}

		MongoClient.connect(mongoUrl, (err, db) => {
			if (err) {
				return;
			}
			this.gDb = db;

			db.on('close', () => {
				this.gDb = null;
			});
			cb(this.gDb);
		});
	}

	putUser(id, data, cb) {
		data.name = id;
		this.mongoConnect(db => {
			db.collection('users').update({name: id}, data, {upsert: true}, err => {
				if (cb) {
					cb(err);
				}
			});
		});
	}

	getUser(id, cb) {
		this.mongoConnect(db => {
			db.collection('users').findOne({name: id}, (err, res) => {
				if (err) {
					console.log(err);
					cb(null);
					return;
				}
				cb(res);
			});
		});
	}

}

module.exports = new MongoHelper();
