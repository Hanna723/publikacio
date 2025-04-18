import { Router, Request, Response } from 'express';
import { HydratedDocument, Types } from 'mongoose';

import { Article, IArticle } from '../models/Article';
import { PublicUser } from '../models/User';
import { Review } from '../models/Review';
import { Role } from '../models/Role';

export const configureReviewRoutes = (router: Router): Router => {
	router.post('/', (req: Request, res: Response) => {
		if (!req.isAuthenticated()) {
			res.status(500).send('User is not logged in.');
			return;
		}

		const user = req.user as PublicUser;
		const userId = new Types.ObjectId(user._id);

		const isAccepted = req.body.isAccepted;
		const article = req.body.article;
		const review = new Review({
			text: req.body.text,
			isAccepted: isAccepted,
			article: article,
			reviewer: user._id,
		});

		Role.findById(user.role)
			.then((role) => {
				if (!role) {
					res.status(500).send('Internal server error');
				} else if (role.name !== 'Reviewer') {
					res.status(401).send('Unauthorized');
				} else {
					Article.findById(article)
						.then((linkedArticle) => {
							if (!linkedArticle) {
								res.status(500).send('Internal server error.');
							} else if (!linkedArticle.reviewers.includes(userId)) {
								res.status(401).send('Unauthorized');
							} else {
								review
									.save()
									.then((data) => {
										res.status(200).send(data);
									})
									.catch((error) => {
										console.log(error);
										res.status(500).send('Internal server error');
									});

								handleArticleAcception(
									article,
									linkedArticle,
									res,
									undefined,
									isAccepted
								);
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

	router.get('/article/:articleId', (req: Request, res: Response) => {
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
				} else {
					Review.find({ article: req.params.articleId })
						.then((reviews) => {
							if (role.name === 'Editor') {
								res.status(200).send(reviews);
							} else if (role.name === 'Reviewer') {
								const reviewsWithAccess = reviews.filter((review) =>
									review.reviewer.equals(userId)
								);
								res.status(200).send(reviewsWithAccess);
							} else {
								Article.findById(req.params.articleId)
									.then((article) => {
										if (!article) {
											res.status(500).send('Internal server error.');
										} else if (!article.author.equals(userId)) {
											res.status(401).send('Unauthorized');
										} else {
											res.status(200).send(reviews);
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
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send('Internal server error.');
			});
	});

	router.get('/:reviewId', (req: Request, res: Response) => {
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
				} else {
					Review.findById(req.params.reviewId)
						.then((review) => {
							if (!review) {
								res.status(404).send('Not found');
							} else {
								if (role.name === 'Reviewer') {
									if (!review.reviewer.equals(userId)) {
										res.status(401).send('Unauthorized');
									} else {
										res.status(200).send(review);
									}
								} else if (role.name === 'Editor') {
									res.status(200).send(review);
								} else {
									Article.findById(review.article)
										.then((article) => {
											if (!article) {
												res.status(500).send('Internal server error.');
											} else if (!article.author.equals(userId)) {
												res.status(401).send('Unauthorized');
											} else {
												res.status(200).send(review);
											}
										})
										.catch((error) => {
											console.log(error);
											res.status(500).send('Internal server error.');
										});
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

	router.post('/:reviewId', (req: Request, res: Response) => {
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
				} else if (role.name !== 'Reviewer') {
					res.status(401).send('Unauthorized');
				} else {
					Review.findById(req.params.reviewId)
						.then((review) => {
							if (!review) {
								res.status(404).send('Not found');
							} else if (!review.reviewer.equals(userId)) {
								res.status(401).send('Unauthorized');
							} else {
								review.text = req.body.text;
								review.isAccepted = req.body.isAccepted;

								Article.findById(review.article)
									.then((article) => {
										if (!article) {
											res.status(500).send('Internal server error.');
										} else {
											review
												.save()
												.then((data) => {
													res.status(200).send(data);
												})
												.catch((error) => {
													console.log(error);
													res.status(500).send('Internal server error');
												});

											handleArticleAcception(
												review.article,
												article,
												res,
												undefined,
												review.isAccepted,
												req.params.reviewId
											);
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
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send('Internal server error.');
			});
	});

	router.delete('/:reviewId', (req: Request, res: Response) => {
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
				} else if (role.name !== 'Reviewer') {
					res.status(401).send('Unauthorized');
				} else {
					Review.findById(req.params.reviewId)
						.then((review) => {
							if (!review) {
								res.status(404).send('Wrong ID');
							} else if (!review.reviewer.equals(userId)) {
								res.status(401).send('Unauthorized');
							} else {
								Article.findById(review.article)
									.then((article) => {
										if (!article) {
											res.status(500).send('Internal server error.');
										} else {
											Review.deleteOne({ _id: review._id })
												.then(() => {
													res.status(200).send('Review deleted.');
												})
												.catch((error) => {
													console.log(error);
													res.status(500).send('Internal server error.');
												});

											handleArticleAcception(
												review.article,
												article,
												res,
												req.params.reviewId
											);
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
				}
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send('Internal server error.');
			});
	});

	function handleArticleAcception(
		articleId: string | Types.ObjectId,
		article: HydratedDocument<IArticle>,
		res: Response,
		deletedReviewId: string | undefined = undefined,
		reviewAccepted: boolean | undefined = undefined,
		updatedReviewId: string | undefined = undefined
	) {
		Review.find({ article: articleId })
			.then((reviews) => {
				let acceptedReviews = reviews.filter(
					(review) =>
						review.isAccepted &&
						review.id !== deletedReviewId &&
						review.id !== updatedReviewId
				).length;
				let allReviews = reviews.filter(
					(review) =>
						review.id !== deletedReviewId && review.id !== updatedReviewId
				).length;

				if (reviewAccepted !== undefined) {
					allReviews++;
					if (reviewAccepted !== false) {
						acceptedReviews++;
					}
				}

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
