import { Router, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';

import { PublicUser, User } from '../models/User';
import { Role } from '../models/Role';

export const configureUserRoutes = (
	passport: PassportStatic,
	router: Router
): Router => {
	router.post('/signup', (req: Request, res: Response) => {
		const user = new User({
			email: req.body.email,
			password: req.body.password,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			role: req.body.role,
		});

		User.exists({ email: user.email })
			.then((existingUser) => {
				if (existingUser) {
					res.status(500).send('Email already in use');
				} else {
					user
						.save()
						.then((data) => {
							res.status(200).send(data);
						})
						.catch((error) => {
							console.log(error);
							res.status(500).send(error);
						});
				}
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
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		req.logout((error) => {
			if (error) {
				console.log(error);
				res.status(500).send('Internal server error.');
			}
			res.status(200).send('Successfully logged out.');
		});
	});

	router.get('/is-authenticated', (req: Request, res: Response) => {
		if (req.isAuthenticated()) {
			res.status(200).send(true);
		} else {
			res.status(500).send(false);
		}
	});

	router.get('/reviewers', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const user = req.user as PublicUser;

		Role.findById(user.role)
			.then((role) => {
				if (!role) {
					res.status(500).send('Internal server error.');
				} else if (role.name !== 'Editor') {
					res.status(401).send('Unauthorized');
				} else {
					Role.findOne({ name: 'Reviewer' })
						.then((reviewerRole) => {
							if (!reviewerRole) {
								res.status(500).send('Internal server error.');
							} else {
								User.find({ role: reviewerRole._id })
									.then((reviewers) => {
										res.status(200).send(reviewers);
									})
									.catch((error) => {
										console.log(error);
										res.status(500).send('Internal server error.');
									});
							}
						})
						.catch((error) => {
							console.log(error);
							res.status(500).send('Internal server error.');
						});
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send('Internal server error.');
			});
	});

	router.delete('/', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const user = req.user as PublicUser;

		req.logout((error) => {
			if (error) {
				console.log(error);
				res.status(500).send('Internal server error.');
			}
			User.deleteOne({ _id: user._id })
				.then(() => {
					res.status(200).send('User deleted.');
				})
				.catch((error) => {
					console.log(error);
					res.status(500).send('Internal server error.');
				});
		});
	});

	return router;
};
