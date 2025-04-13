import { Router, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';

import { User } from '../models/User';

export const configureUserRoutes = (
	passport: PassportStatic,
	router: Router
): Router => {
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
				console.log(data);
				res.status(200).send(data);
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send(error);
			});
	});

	router.post('/login', (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate(
			'local',
			(error: string | null, user: typeof User) => {
				if (error) {
					res.status(500).send(error);
				} else {
					if (!user) {
						res.status(400).send('User not found.');
					} else {
						req.login(user, (err: string | null) => {
							if (err) {
								console.log(err);
								res.status(500).send('Internal server error.');
							} else {
								res.status(200).send(user);
							}
						});
					}
				}
			}
		)(req, res, next);
	});

	router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/is-authenticated', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);            
        } else {
            res.status(500).send(false);
        }
    });

	return router;
};
