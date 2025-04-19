import { Router, Request, Response, NextFunction } from 'express';
import { HydratedDocument, Types } from 'mongoose';
import { PassportStatic } from 'passport';

import { Article, IArticle } from '../models/Article';
import { PublicUser, User } from '../models/User';
import { Review } from '../models/Review';
import { Role, RoleName } from '../models/Role';

export const configureUserRoutes = (
	passport: PassportStatic,
	router: Router
): Router => {
	router.post('/signup', (req: Request, res: Response) => {
		if (req.isAuthenticated()) {
			res.status(500).send('User already logged in.');
			return;
		}

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
					res.status(400).send('Email already in use');
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
		if (req.isAuthenticated()) {
			res.status(500).send('User already logged in.');
			return;
		}

		passport.authenticate(
			'local',
			(error: string | null, user: typeof User) => {
				if (error) {
					res.status(400).send(error);
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
			res.status(200).send(false);
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
				} else if (role.name !== RoleName.EDITOR) {
					res.status(401).send('Unauthorized');
				} else {
					Role.findOne({ name: RoleName.REVIEWER })
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
		const userId = new Types.ObjectId(user._id);

		req.logout((error) => {
			if (error) {
				console.log(error);
				res.status(500).send('Internal server error.');
			}

			Role.findById(user.role)
				.then((role) => {
					if (!role) {
						res.status(500).send('Internal server error.');
					} else {
						if (role.name === RoleName.AUTHOR) {
							Article.find({ author: userId })
								.then((articles) => {
									articles.forEach((article) => {
										Review.deleteMany({ article: article._id })
											.then(() => {
												console.log("Reviews of author's article deleted.");
											})
											.catch((error) => {
												console.log(error);
												res.status(500).send('Internal server error.');
											});
									});
								})
								.catch((error) => {
									console.log(error);
									res.status(500).send('Internal server error.');
								});

							Article.deleteMany({ author: userId })
								.then(() => {
									console.log('Articles of author deleted.');
								})
								.catch((error) => {
									console.log(error);
									res.status(500).send('Internal server error.');
								});
						} else if (role.name === RoleName.REVIEWER) {
							Review.deleteMany({ reviewer: userId })
								.then(() => {
									console.log('Reviews of reviewer deleted.');
								})
								.catch((error) => {
									console.log(error);
									res.status(500).send('Internal server error.');
								});

							Article.find()
								.then((articles) => {
									articles = articles.filter((article) =>
										article.reviewers.includes(userId)
									);

									articles.forEach((article) => {
										article.reviewers = article.reviewers.filter(
											(reviewer) => !reviewer.equals(userId)
										);

										handleArticleAcception(article._id, article, res, userId);
									});
								})
								.catch((error) => {
									console.log(error);
									res.status(500).send('Internal server error.');
								});
						}

						User.deleteOne({ _id: user._id })
							.then(() => {
								res.status(200).send('User deleted.');
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
	});

	router.post('/update', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const publicUser = req.user as PublicUser;

		User.findById(publicUser._id)
			.then((user) => {
				if (!user) {
					res.status(500).send('Internal server error');
				} else {
					User.updateOne(
						{ _id: user._id },
						{ firstName: req.body.firstName, lastName: req.body.lastName }
					)
						.then((data) => {
							res.status(200).send(data);
						})
						.catch((error) => {
							console.log(error);
							res.status(500).send('Internal server error');
						});
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send('Internal server error.');
			});
	});

	router.post('/update-password', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const publicUser = req.user as PublicUser;

		User.findById(publicUser._id)
			.then((user) => {
				if (!user) {
					res.status(500).send('Internal server error');
				} else {
					user.comparePassword(req.body.password, (error, isMatch) => {
						if (error) {
							console.log(error);
							res.status(500).send(error);
						} else if (!isMatch) {
							res.status(500).send('Incorrect password');
						} else {
							user.password = req.body.newPassword;
							user
								.save()
								.then((data) => {
									res.status(200).send(data);
								})
								.catch((error) => {
									console.log(error);
									res.status(500).send('Internal server error');
								});
						}
					});
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send('Internal server error.');
			});
	});

	router.get('/', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const user = req.user as PublicUser;

		Role.findById(user.role)
			.then((role) => {
				if (!role) {
					res.status(500).send('Internal server error.');
				} else {
					res.status(200).send({
						id: user._id,
						firstName: user.firstName,
						lastName: user.lastName,
						role: role.name,
					});
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send('Internal server error.');
			});
	});

	router.get('/:userId', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		User.findById(req.params.userId)
			.then((user) => {
				if (!user) {
					res.status(404).send('Wrong ID');
				} else {
					Role.findById(user.role)
						.then((role) => {
							if (!role) {
								res.status(500).send('Internal server error.');
							} else {
								res.status(200).send({
									id: user._id,
									firstName: user.firstName,
									lastName: user.lastName,
									role: role.name,
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

	function handleArticleAcception(
		articleId: Types.ObjectId,
		article: HydratedDocument<IArticle>,
		res: Response,
		deletedReviewerId: Types.ObjectId
	) {
		Review.find({ article: articleId })
			.then((reviews) => {
				let acceptedReviews = reviews.filter(
					(review) =>
						review.isAccepted && !review.reviewer.equals(deletedReviewerId)
				).length;
				let allReviews = reviews.filter(
					(review) => !review.reviewer.equals(deletedReviewerId)
				).length;

				if (allReviews === 2 && acceptedReviews === 2) {
					article.isAccepted = true;
				} else if (allReviews > 2 && acceptedReviews >= 2) {
					article.isAccepted = true;
				} else if (allReviews > 2) {
					article.isAccepted = false;
				} else {
					article.isAccepted = undefined;
				}

				article
					.save()
					.then(() => {
						console.log('Article accepted: ' + article.isAccepted);
					})
					.catch((error) => {
						console.log(error);
						res.status(500).send('Internal server error');
					});
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send('Internal server error.');
			});
	}

	return router;
};
