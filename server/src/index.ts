import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import client from 'prom-client';

import { configureArticleRoutes } from './routes/article-routes';
import { configurePassport } from './passport/passport';
import { configureReviewRoutes } from './routes/review-routes';
import { configureRoleRoutes } from './routes/role-routes';
import { configureUserRoutes } from './routes/user-routes';

const app = express();
const port = 5000;
const dbUrl = process.env.MONGO_URL;
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
	name: 'http_request_duration_seconds',
	help: 'Duration of HTTP requests in seconds',
	labelNames: ['method', 'path', 'status_code'],
	buckets: [0.01, 0.05, 0.1, 0.5, 1],
});

const httpRequestTotal = new client.Counter({
	name: 'http_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method', 'path', 'status_code'],
});

const calculationErrors = new client.Counter({
	name: 'calculation_errors_total',
	help: 'Total number of calculation errors',
	labelNames: ['error_type'],
});

const calculationTotal = new client.Counter({
	name: 'calculations_total',
	help: 'Total number of calculations performed',
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(calculationErrors);
register.registerMetric(calculationTotal);

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

app.get('/metrics', async (_, res) => {
	res.setHeader('Content-Type', register.contentType);

	try {
		const metrics = await register.metrics();
		res.writeHead(200);
		res.end(metrics);
	} catch (err) {
		res.writeHead(500);
		res.end('Error collecting metrics: ' + err);
	}
});

app.use('/api/article', configureArticleRoutes(express.Router()));
app.use('/api/review', configureReviewRoutes(express.Router()));
app.use('/api/roles', configureRoleRoutes(express.Router()));
app.use('/api/user', configureUserRoutes(passport, express.Router()));

app.listen(port, '0.0.0.0', () => {
	console.log('Server is listening on port ' + port.toString());
});
