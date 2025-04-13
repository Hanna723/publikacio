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
	{ _id: '67f2ffa3768572e24b9f0efb', name: 'Author' },
	{ _id: '67f2ffac768572e24b9f0efd', name: 'Reviewer' },
	{ _id: '67f2ffb4768572e24b9f0eff', name: 'Editor' },
]);

db.articles.insert({
	_id: '67f2f12b4ff1117b9f38bc48',
	author: '67f2f0a94ff1117b9f38bc44',
	title: 'My article',
	content: 'This is my very first article.',
	reviewers: ['67f2ef4a4ff1117b9f38bc40'],
	isAccepted: false,
});

db.reviews.insert({
	_id: '67f2f0134ff1117b9f38bc42',
	text: 'Very good',
	isAccepted: true,
	article: '67f2f12b4ff1117b9f38bc48',
	reviewer: '67f2ef4a4ff1117b9f38bc40',
});

db.users.insertMany([
	{
		_id: '67f2ef4a4ff1117b9f38bc40',
		email: 'reviewer@mailinator.com',
		password: '',
		firstName: 'Réka',
		lastName: 'Reviewer',
		role: '67f2ffac768572e24b9f0efd',
	},
	{
		_id: '67f2f0a94ff1117b9f38bc44',
		email: 'author@mailinator.com',
		password: '',
		firstName: 'Augusztus',
		lastName: 'Author',
		role: '67f2ffa3768572e24b9f0efb',
	},
	{
		_id: '67f2f0dd4ff1117b9f38bc46',
		email: 'editor@mailinator.com',
		password: '',
		firstName: 'Edit',
		lastName: 'Editor',
		role: '67f2ffb4768572e24b9f0eff',
	},
]);
