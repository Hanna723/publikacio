import { Router, Request, Response } from 'express';

import { PublicUser } from '../models/User';
import { Role } from '../models/Role';
import { Article } from '../models/Article';
import { ObjectId } from 'mongoose';

export const configureArticleRoutes = (router: Router): Router => {
	router.post('/', (req: Request, res: Response) => {
		if (req.isAuthenticated()) {
			const user = req.user as PublicUser;

			const author = user._id;
			const title = req.body.title;
			const content = req.body.content;
			const readyForReview = req.body.readyForReview;
			const reviewers: ObjectId[] = [];
			const isAccepted = false;
			const article = new Article({
				author: author,
				title: title,
				content: content,
				readyForReview: readyForReview,
				reviewers: reviewers,
				isAccepted: isAccepted,
			});

			Role.findById(user.role).then((role) => {
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
			});
		} else {
			res.status(500).send('User is not logged in.');
		}
	});

	return router;
};
