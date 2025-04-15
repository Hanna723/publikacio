import { Router, Request, Response } from 'express';

import { PublicUser } from '../models/User';
import { Role } from '../models/Role';
import { Article, IArticle } from '../models/Article';
import mongoose, { Types } from 'mongoose';

export const configureArticleRoutes = (router: Router): Router => {
	router.post('/', (req: Request, res: Response) => {
		if (req.isAuthenticated()) {
			const user = req.user as PublicUser;
			console.log(user);

			const author = user._id;
			const title = req.body.title;
			const content = req.body.content;
			const readyForReview = req.body.readyForReview;
			const reviewers: Types.ObjectId[] = [];
			const isAccepted = false;
			const article = new Article({
				author: author,
				title: title,
				content: content,
				readyForReview: readyForReview,
				reviewers: reviewers,
				isAccepted: isAccepted,
			});

			Role.findById(user.role)
				.then((role) => {
					console.log(role);
					if (!role) {
						res.status(500).send('Internal server error');
					} else if (role.name !== 'Author') {
						res.status(401).send('Unauthorized');
					} else {
						article
							.save()
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
		} else {
			res.status(500).send('User is not logged in.');
		}
	});

	router.get('/all', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const user = req.user as PublicUser;

		Role.findById(user.role)
			.then((role) => {
				console.log(role);
				if (!role) {
					console.log('No role');
					res.status(500).send('Internal server error');
				} else {
					Article.find()
						.then((articles) => {
							console.log(articles);
							const articlesWithAccess = articles.filter((article) =>
								hasAccessToArticle(article, user, role.name)
							);
							res.status(200).send(articlesWithAccess);
						})
						.catch((error) => {
							console.log('178');
							console.log(error);
							res.status(500).send('Internal server error.');
						});
				}
			})
			.catch((error) => {
				console.log('185');
				console.log(error);
				res.status(500).send('Internal server error.');
			});
	});

	router.post('/:articleId', (req: Request, res: Response) => {
		if (req.isAuthenticated()) {
			const user = req.user as PublicUser;

			Role.findById(user.role)
				.then((role) => {
					if (!role) {
						res.status(500).send('Internal server error');
					} else if (role.name === 'Reviewer') {
						res.status(401).send('Unauthorized');
					} else {
						Article.findById(req.params.articleId)
							.then((article) => {
								if (!article) {
									res.status(404).send('Not found');
								} else {
									if (role.name === 'Author') {
										if (article.readyForReview) {
											res.status(500).send('This article cannot be edited');
											return;
										} else {
											article.title = req.body.title;
											article.content = req.body.content;
											article.readyForReview = req.body.readyForReview;
										}
									} else {
										if (!article.readyForReview) {
											res
												.status(500)
												.send('This article is not ready to be reviewed');
											return;
										} else {
											article.reviewers = req.body.reviewers;
										}
									}
									article
										.save()
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
					}
				})
				.catch((error) => {
					console.log(error);
					res.status(500).send('Internal server error.');
				});
		} else {
			res.status(500).send('User is not logged in.');
		}
	});

	router.get('/:articleId', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const user = req.user as PublicUser;
		Role.findById(user.role)
			.then((role) => {
				if (!role) {
					res.status(500).send('Internal server error');
				} else {
					Article.findById(req.params.articleId)
						.then((article) => {
							if (!article) {
								res.status(404).send('Wrong ID');
							} else {
								if (hasAccessToArticle(article, user, role.name)) {
									res.status(200).send(article);
								} else {
									res.status(401).send('Unauthorized');
								}
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

	router.delete('/:articleId', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const user = req.user as PublicUser;
		const userId = new Types.ObjectId(user._id);

		Role.findById(user.role)
			.then((role) => {
				if (!role) {
					res.status(500).send('Internal server error');
				} else if (role.name !== 'Author') {
					res.status(401).send('Unauthorized');
				} else {
					Article.findById(req.params.articleId)
						.then((article) => {
							if (!article) {
								res.status(404).send('Wrong ID');
							} else if (!article.author.equals(userId)) {
								res.status(401).send('Unauthorized');
							} else {
								Article.deleteOne({ _id: article._id })
									.then(() => {
										res.status(200).send('Article deleted.');
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

	function hasAccessToArticle(
		article: IArticle,
		user: PublicUser,
		role: string
	): boolean {
		const userId = new Types.ObjectId(user._id);

		if (role === 'Author') {
			if (article.author.equals(userId)) {
				return true;
			} else {
				return false;
			}
		} else if (role === 'Editor') {
			if (article.readyForReview) {
				return true;
			} else {
				return false;
			}
		} else {
			if (article.reviewers.includes(userId)) {
				return true;
			} else {
				return false;
			}
		}
	}

	return router;
};
