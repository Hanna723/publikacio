import express from 'express';
import mongoose from 'mongoose';

import { Request, Response } from 'express';

const app = express();
const port = 5000;
const dbUrl = 'mongodb://publicationAdmin:example@localhost:27017/publication';

mongoose
	.connect(dbUrl)
	.then(() => {
		console.log('Succesfully connected');
	})
	.catch((error) => {
		console.log(error);
		return;
	});

app.get('/', (req: Request, res: Response) => {
	res.status(200).send('Hello, World!');
});

app.listen(port, () => {
	console.log('Server is listening on port ' + port.toString());
});
