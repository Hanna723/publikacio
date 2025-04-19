db = db.getSiblingDB('publication');

db.createUser({
	user: 'publicationAdmin',
	pwd: 'example',
	roles: [
		{
			role: 'readWrite',
			db: 'publication',
		},
	],
});

db.roles.insertMany([
	{ _id: new ObjectId('67f2ffa3768572e24b9f0efb'), name: 'Author' },
	{ _id: new ObjectId('67f2ffac768572e24b9f0efd'), name: 'Reviewer' },
	{ _id: new ObjectId('67f2ffb4768572e24b9f0eff'), name: 'Editor' },
]);

db.articles.insertMany([
	{
		_id: new ObjectId('67f2f12b4ff1117b9f38bc48'),
		author: new ObjectId('67f2f0a94ff1117b9f38bc44'),
		title: 'My article',
		content: 'This is my very first article.',
		readyForReview: true,
		reviewers: [new ObjectId('67f2ef4a4ff1117b9f38bc40')],
		isAccepted: false,
	},
	{
		_id: new ObjectId('67fc3ab6cc5839ee960be5cc'),
		author: new ObjectId('67f2f0a94ff1117b9f38bc44'),
		title: 'WIP',
		content: 'Still working on this article.',
		readyForReview: false,
		reviewers: [],
		isAccepted: false,
	},
]);

db.reviews.insert({
	_id: new ObjectId('67f2f0134ff1117b9f38bc42'),
	text: 'Very good',
	isAccepted: true,
	article: new ObjectId('67f2f12b4ff1117b9f38bc48'),
	reviewer: new ObjectId('67f2ef4a4ff1117b9f38bc40'),
});

db.users.insertMany([
	{
		_id: new ObjectId('67f2ef4a4ff1117b9f38bc40'),
		email: 'reviewer@mailinator.com',
		password: '$2b$10$J24KEBUadiz8u6CmBPLNTes7dXTW9bmRawoVrhy.p.eyiSKXgcokK',
		firstName: 'Réka',
		lastName: 'Reviewer',
		role: new ObjectId('67f2ffac768572e24b9f0efd'),
	},
	{
		_id: new ObjectId('67f2f0a94ff1117b9f38bc44'),
		email: 'author@mailinator.com',
		password: '$2b$10$J24KEBUadiz8u6CmBPLNTes7dXTW9bmRawoVrhy.p.eyiSKXgcokK',
		firstName: 'Augusztus',
		lastName: 'Author',
		role: new ObjectId('67f2ffa3768572e24b9f0efb'),
	},
	{
		_id: new ObjectId('67f2f0dd4ff1117b9f38bc46'),
		email: 'editor@mailinator.com',
		password: '$2b$10$J24KEBUadiz8u6CmBPLNTes7dXTW9bmRawoVrhy.p.eyiSKXgcokK',
		firstName: 'Edit',
		lastName: 'Editor',
		role: new ObjectId('67f2ffb4768572e24b9f0eff'),
	},
]);
