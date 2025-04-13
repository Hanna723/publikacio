import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';

import { configureUserRoutes } from './routes/user-routes';
import { configurePassport } from './passport/passport';
import { configureRoleRoutes } from './routes/role-routes';
import { configureArticleRoutes } from './routes/article-routes';

const app = express();
const port = 5000;
const dbUrl = 'mongodb://publicationAdmin:example@localhost:27017/publication';

mongoose
	.connect(dbUrl)
	.then(() => {
		console.log('Succesfully connected');
	})
	.catch((error) => {
		console.log(error);
		return;
	});

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
app.use('/roles', configureRoleRoutes(express.Router()));
app.use('/user', configureUserRoutes(passport, express.Router()));

app.listen(port, () => {
	console.log('Server is listening on port ' + port.toString());
});
