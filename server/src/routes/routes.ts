import { Router, Request, Response } from 'express';
import { PassportStatic } from 'passport';

import { User } from '../models/User';

export const configureRoutes = (passport: PassportStatic, router: Router): Router => {
	router.post('/signup', (req: Request, res: Response) => {
		const email = req.body.email;
		const password = req.body.password;
		const firstName = req.body.firstName;
		const lastName = req.body.lastName;
		const role = req.body.role;
		const user = new User({
			email: email,
			password: password,
			firstName: firstName,
			lastName: lastName,
			role: role,
		});

		user
			.save()
			.then((data) => {
                console.log(data)
				res.status(200).send(data);
			})
			.catch((error) => {
                console.log(error)
				res.status(500).send(error);
			});
	});

	return router;
};
