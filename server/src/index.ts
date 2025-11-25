import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';

import { configureArticleRoutes } from './routes/article-routes';
import { configurePassport } from './passport/passport';
import { configureReviewRoutes } from './routes/review-routes';
import { configureRoleRoutes } from './routes/role-routes';
import { configureUserRoutes } from './routes/user-routes';

const app = express();
const port = 5000;
const dbUrl = process.env.MONGO_URL;

if (dbUrl) {
	mongoose
		.connect(dbUrl)
		.then(() => {
			console.log('Succesfully connected');
		})
		.catch((error) => {
			console.log(error);
			return;
		});
}

const whitelist = ['*', 'http://localhost:4200'];
const corsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allowed?: boolean) => void
	) => {
		if (whitelist.indexOf(origin!) !== -1 || whitelist.includes('*')) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS.'));
		}
	},
	credentials: true,
};

const sessionOptions: expressSession.SessionOptions = {
	secret: 'publication-secret',
	resave: false,
	saveUninitialized: false,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/article', configureArticleRoutes(express.Router()));
app.use('/review', configureReviewRoutes(express.Router()));
app.use('/roles', configureRoleRoutes(express.Router()));
app.use('/user', configureUserRoutes(passport, express.Router()));

app.listen(port, () => {
	console.log('Server is listening on port ' + port.toString());
});
