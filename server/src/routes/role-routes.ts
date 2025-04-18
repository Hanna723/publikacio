import { Router, Request, Response } from 'express';

import { Role } from '../models/Role';

export const configureRoleRoutes = (router: Router): Router => {
	router.get('/', (req: Request, res: Response) => {
		const query = Role.find();
		query
			.then((data) => {
				res.status(200).send(data);
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send('Internal server error.');
			});
	});

	return router;
};
