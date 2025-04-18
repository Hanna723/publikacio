import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';

import { Article, IArticle } from '../models/Article';
import { PublicUser } from '../models/User';
import { Review } from '../models/Review';
import { Role, RoleName } from '../models/Role';

export const configureArticleRoutes = (router: Router): Router => {
	router.post('/', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const user = req.user as PublicUser;
		const article = new Article({
			author: user._id,
			title: req.body.title,
			content: req.body.content,
			readyForReview: req.body.readyForReview,
			reviewers: [],
			isAccepted: undefined,
		});

		Role.findById(user.role)
			.then((role) => {
				if (!role) {
					res.status(500).send('Internal server error');
				} else if (role.name !== RoleName.AUTHOR) {
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
	});

	router.get('/all', (req: Request, res: Response) => {
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
					Article.find()
						.then((articles) => {
							const articlesWithAccess = articles.filter((article) =>
								hasAccessToArticle(article, user, role.name)
							);
							res.status(200).send(articlesWithAccess);
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

	router.post('/:articleId', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const user = req.user as PublicUser;

		Role.findById(user.role)
			.then((role) => {
				if (!role) {
					res.status(500).send('Internal server error');
				} else if (role.name === RoleName.REVIEWER) {
					res.status(401).send('Unauthorized');
				} else {
					Article.findById(req.params.articleId)
						.then((article) => {
							if (!article) {
								res.status(404).send('Not found');
							} else {
								if (role.name === RoleName.AUTHOR) {
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
				} else if (role.name !== RoleName.AUTHOR) {
					res.status(401).send('Unauthorized');
				} else {
					Article.findById(req.params.articleId)
						.then((article) => {
							if (!article) {
								res.status(404).send('Wrong ID');
							} else if (!article.author.equals(userId)) {
								res.status(401).send('Unauthorized');
							} else {
								Review.deleteMany({ article: article._id })
									.then(() => {
										console.log('Reviews of article deleted.');
									})
									.catch((error) => {
										console.log(error);
										res.status(500).send('Internal server error.');
									});

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

		if (role === RoleName.AUTHOR) {
			if (article.author.equals(userId)) {
				return true;
			} else {
				return false;
			}
		} else if (role === RoleName.EDITOR) {
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
