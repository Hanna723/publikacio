import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';

import { User } from '../models/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {
	passport.serializeUser((user: Express.User, done) => {
		console.log('user is serialized.');
		done(null, user);
	});

	passport.deserializeUser((id: string, done) => {
		User.findById(id)
			.then((user) => {
				console.log('user is deserialized.');
				done(null, user);
			})
			.catch((error) => {
				done(error);
			});
	});

	passport.use(
		'local',
		new Strategy(
			{ usernameField: 'email', passwordField: 'password' },
			(email, password, done) => {
				User.findOne({ email: email })
					.then((user) => {
						if (user) {
							user.comparePassword(password, (error, isMatch) => {
								if (error || !isMatch) {
									done('Incorrect username or password.');
								} else {
									const publicUser = {
										_id: user._id,
										email: user.email,
										firstName: user.firstName,
										lastName: user.lastName,
										role: user.role,
									};
									done(null, publicUser);
								}
							});
						} else {
							done(null, undefined);
						}
					})
					.catch((error) => {
						done(error);
					});
			}
		)
	);

	return passport;
};
