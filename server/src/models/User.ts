import bcrypt from 'bcrypt';
import mongoose, { Model, Schema } from 'mongoose';

const SALT_FACTOR = 10;

interface IUser extends Document {
	// id: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: string;
	comparePassword: (
		candidatePassword: string,
		callback: (error: Error | null, isMatch: boolean) => void
	) => void;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
	// id: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	role: { type: String, required: true },
});

UserSchema.pre<IUser>('save', function (next) {
	const user = this;

	bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
		if (error) {
			return next(error);
		}
		bcrypt.hash(user.password, salt, (err, encrypted) => {
			if (err) {
				return next(err);
			}
			user.password = encrypted;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function (
	candidatePassword: string,
	callback: (error: Error | null, isMatch: boolean) => void
): void {
	const user = this;
	bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
		if (error) {
			callback(error, false);
		}
		callback(null, isMatch);
	});
};

export const User: Model<IUser> = mongoose.model<IUser>('users', UserSchema);
