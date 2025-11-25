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
		_id: new ObjectId('68058517a698a4a42fdb1a13'),
		author: new ObjectId('680582fca698a4a42fdb19fe'),
		title: 'Cat',
		content:
			'The cat (Felis catus), also referred to as the domestic cat or house cat, is a small domesticated carnivorous mammal. It is the only domesticated species of the family Felidae. Advances in archaeology and genetics have shown that the domestication of the cat occurred in the Near East around 7500 BC. It is commonly kept as a pet and farm cat, but also ranges freely as a feral cat avoiding human contact. It is valued by humans for companionship and its ability to kill vermin. Its retractable claws are adapted to killing small prey species such as mice and rats. It has a strong, flexible body, quick reflexes, and sharp teeth, and its night vision and sense of smell are well developed. It is a social species, but a solitary hunter and a crepuscular predator.\nCat intelligence is evident in their ability to adapt, learn through observation, and solve problems, with research showing they possess strong memories, exhibit neuroplasticity, and display cognitive skills comparable to a young child. Cat communication includes meowing, purring, trilling, hissing, growling, grunting, and body language. It can hear sounds too faint or too high in frequency for human ears, such as those made by small mammals. It secretes and perceives pheromones.\n\nFemale domestic cats can have kittens from spring to late autumn in temperate zones and throughout the year in equatorial regions, with litter sizes often ranging from two to five kittens. Domestic cats are bred and shown at cat fancy events as registered pedigreed cats. Population control includes spaying and neutering, but pet abandonment has exploded the global feral cat population, which has driven the extinction of bird, mammal, and reptile species.\n\nDomestic cats are found across the globe, though their popularity as pets varies by region. Out of the estimated 600 million cats worldwide, 400 million reside in Asia, including 58 million pet cats in China. The United States leads in cat ownership with 73.8 million cats despite having a significantly smaller human population. In the United Kingdom, approximately 10.9 million domestic cats are kept as pets.',
		readyForReview: true,
		reviewers: [
			new ObjectId('67f2ef4a4ff1117b9f38bc40'),
			new ObjectId('68058358a698a4a42fdb1a06'),
		],
		isAccepted: false,
	},
	{
		_id: new ObjectId('68058635a698a4a42fdb1a5f'),
		author: new ObjectId('680582fca698a4a42fdb19fe'),
		title: 'Instant soup',
		content:
			'Commercially prepared instant soups are usually dried or dehydrated, canned, or treated by freezing. Some dry instant soups are prepared with thickening ingredients, such as pregelatinized starch, that function at a lower temperature[9] compared to others. Additional ingredients used in commercial instant soups to contribute to their consistency include maltodextrins, emulsified fat powders, sugars, potato starch, xanthan gum, and guar gum. Sometimes ingredients used in dry instant soups are ground into fragments, which enables them to be dissolved[9] when water is added. These particulates are sometimes prepared using freeze-drying and puff drying.',
		readyForReview: false,
		reviewers: [],
	},
	{
		_id: new ObjectId('6805866ca698a4a42fdb1a7c'),
		author: new ObjectId('680582fca698a4a42fdb19fe'),
		title: 'Szegedi Tudományegyetem',
		content:
			'A Szegedi Tudományegyetem (röviden: SZTE) – Universitas Scientiarum Szegediensis / University of Szeged – Magyarországon, Szeged városában működő, közfeladatot ellátó, közérdekű vagyonkezelő alapítvány által fenntartott felsőoktatási intézmény. A korábbi szegedi József Attila Tudományegyetem (JATE), a Szent-Györgyi Albert Orvostudományi Egyetem (SZOTE), a Szegedi Élelmiszeripari Főiskola (SZÉF), a Juhász Gyula Tanárképző Főiskola (JGYTF), a Liszt Ferenc Zeneművészeti Főiskola Szegedi Konzervatóriuma és a Hódmezővásárhelyen működő Mezőgazdasági Főiskola összevonásával alakult meg 2000. január 1-jén. A Szegedi Tudományegyetem szenátusának 2007. júliusi határozata értelmében jogelődje az 1581. május 12-én Báthory István által alapított kolozsvári katolikus egyetem.\n\nAz SZTE világszerte legismertebb kutatója Szent-Györgyi Albert, aki a biológiai égés folyamatával kapcsolatos felfedezéseiért, különösen a C-vitaminnal és fumársav katalizátorral végzett kutatómunkája elismeréseképpen 1937-ben nyerte el a Nobel-díjat. 2020-ban a Dékáni Kollégiuma döntése értelmében a Szegedi Tudományegyetem egy állandó jelzőt kap: „Szent-Györgyi Albert egyeteme”.\n\nAz SZTE korábbi hallgatói közül világhírű lett a Nobel-díjas (2023) Karikó Katalin kutatóbiológus, biokémikus, a szintetikus mRNS alapú vakcinák technológiájának szabadalmaztatója. A Covid19-pandémia kezelésében kulcsszerepű tudóst díszdoktori címmel tüntette ki alma matere 2021-ben.\n\nA HVG 2021-es felsőoktatási rangsora szerint a Szegedi Tudományegyetem a 2. legjobb egyetem Magyarországon.',
		readyForReview: true,
		reviewers: [new ObjectId('67f2ef4a4ff1117b9f38bc40')],
	},
	{
		_id: new ObjectId('680586cba698a4a42fdb1aca'),
		author: new ObjectId('67f2f0a94ff1117b9f38bc44'),
		title: 'A fekete zongora',
		content:
			'Bolond hangszer: sír, nyerit és búg.\nFusson, akinek nincs bora,\nEz a fekete zongora.\nVak mestere tépi, cibálja,\nEz az Élet melódiája.\nEz a fekete zongora.\n \nFejem zúgása, szemem könnye,\nTornázó vágyaim tora,\nEz mind, mind: ez a zongora.\nBoros, bolond szivemnek vére\nKiömlik az ő ütemére.\nEz a fekete zongora.',
		readyForReview: true,
		reviewers: [
			new ObjectId('67f2ef4a4ff1117b9f38bc40'),
			new ObjectId('68058358a698a4a42fdb1a06'),
		],
		isAccepted: true,
	},
	{
		_id: new ObjectId('680587c0a698a4a42fdb1afc'),
		author: new ObjectId('67f2f0a94ff1117b9f38bc44'),
		title: 'Videón, ahogy biciklin visz valaki egy hűtőszekrényt',
		content:
			'Korábban díványt és tv-t is szállított már így.\nFurcsa videó terjed az interneten: New Yorkban valaki felvette, ahogy egy férfi unortodox módon szállít egy hűtőszekrényt. Először is megmutatjuk, utána jöjjenek a részletek.\nA New York Post cikkéből kiderül, hogy a videó főszereplője egy bizonyos Leh-Boy Gabriel Davis, a sajátos szállítási módot pedig nem azért választotta, mert csak így tudta hazafuvarozni a hűtőt, hanem épp edzésben lehetett, ugyanis számtalan videón feltűnt már korábban is hasonló mutatvánnyal: 2023-ban például egy díványt vitt az utcákon hasonló módszerrel, de azt is megörökítették, ahogy egy tv-készülékkel egyensúlyozik.\n\nA hűtőszekrényes videó a Redditre is felkerült, ahol ezt írta egy kommentelő: „A srác csontkovácsának minden bizonnyal pénzből épült a háza”.',
		readyForReview: true,
		reviewers: [],
	},
]);

db.reviews.insertMany([
	{
		_id: new ObjectId('68058842a698a4a42fdb1bec'),
		text: 'A bevezető rész nagyon tetszett, de a későbbiekben elkalandozott a figyelmem.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		isAccepted: false,
		article: new ObjectId('68058517a698a4a42fdb1a13'),
		reviewer: new ObjectId('67f2ef4a4ff1117b9f38bc40'),
	},
	{
		_id: new ObjectId('6805885ca698a4a42fdb1c43'),
		text: 'Lehetett volna jobb is. Ennél többet vártam.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		isAccepted: false,
		article: new ObjectId('68058517a698a4a42fdb1a13'),
		reviewer: new ObjectId('67f2ef4a4ff1117b9f38bc40'),
	},
	{
		_id: new ObjectId('68058868a698a4a42fdb1c7a'),
		text: 'Nagyon tetszett, csak így tovább.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		isAccepted: true,
		article: new ObjectId('680586cba698a4a42fdb1aca'),
		reviewer: new ObjectId('67f2ef4a4ff1117b9f38bc40'),
	},
	{
		_id: new ObjectId('6805889ba698a4a42fdb1d7e'),
		text: 'Véleményem szerint az alábbi pontokon lehetne javítani:\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		isAccepted: false,
		article: new ObjectId('68058517a698a4a42fdb1a13'),
		reviewer: new ObjectId('68058358a698a4a42fdb1a06'),
	},
	{
		_id: new ObjectId('680588aba698a4a42fdb1dcf'),
		text: 'A legjobb cikk, amit valaha olvastam!\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		isAccepted: true,
		article: new ObjectId('680586cba698a4a42fdb1aca'),
		reviewer: new ObjectId('68058358a698a4a42fdb1a06'),
	},
]);

db.users.insertMany([
	{
		_id: new ObjectId('67f2f0a94ff1117b9f38bc44'),
		email: 'author1@mailinator.com',
		password: '$2b$10$J24KEBUadiz8u6CmBPLNTes7dXTW9bmRawoVrhy.p.eyiSKXgcokK',
		firstName: 'Augusztus',
		lastName: 'Author',
		role: new ObjectId('67f2ffa3768572e24b9f0efb'),
	},
	{
		_id: new ObjectId('680582fca698a4a42fdb19fe'),
		email: 'author2@mailinator.com',
		password: '$2b$10$J24KEBUadiz8u6CmBPLNTes7dXTW9bmRawoVrhy.p.eyiSKXgcokK',
		firstName: 'Auróra',
		lastName: 'Author',
		role: new ObjectId('67f2ffa3768572e24b9f0efb'),
	},
	{
		_id: new ObjectId('67f2f0dd4ff1117b9f38bc46'),
		email: 'editor1@mailinator.com',
		password: '$2b$10$J24KEBUadiz8u6CmBPLNTes7dXTW9bmRawoVrhy.p.eyiSKXgcokK',
		firstName: 'Edit',
		lastName: 'Editor',
		role: new ObjectId('67f2ffb4768572e24b9f0eff'),
	},
	{
		_id: new ObjectId('6805832ba698a4a42fdb1a02'),
		email: 'editor2@mailinator.com',
		password: '$2b$10$J24KEBUadiz8u6CmBPLNTes7dXTW9bmRawoVrhy.p.eyiSKXgcokK',
		firstName: 'Edvin',
		lastName: 'Editor',
		role: new ObjectId('67f2ffb4768572e24b9f0eff'),
	},
	{
		_id: new ObjectId('67f2ef4a4ff1117b9f38bc40'),
		email: 'reviewer1@mailinator.com',
		password: '$2b$10$J24KEBUadiz8u6CmBPLNTes7dXTW9bmRawoVrhy.p.eyiSKXgcokK',
		firstName: 'Réka',
		lastName: 'Reviewer',
		role: new ObjectId('67f2ffac768572e24b9f0efd'),
	},
	{
		_id: new ObjectId('68058358a698a4a42fdb1a06'),
		email: 'reviewer2@mailinator.com',
		password: '$2b$10$J24KEBUadiz8u6CmBPLNTes7dXTW9bmRawoVrhy.p.eyiSKXgcokK',
		firstName: 'Regő',
		lastName: 'Reviewer',
		role: new ObjectId('67f2ffac768572e24b9f0efd'),
	},
]);
