import bcrypt from 'bcrypt';
import mongoose, { Model, Schema, Types } from 'mongoose';

const SALT_FACTOR = 10;

interface IUser extends Document {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: Types.ObjectId;
	comparePassword: (
		candidatePassword: string,
		callback: (error: Error | null, isMatch: boolean) => void
	) => void;
}

export interface PublicUser {
	_id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: Types.ObjectId;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	role: { type: Schema.Types.ObjectId, required: true },
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
