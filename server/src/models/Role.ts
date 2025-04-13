import bcrypt from 'bcrypt';
import mongoose, { Model, ObjectId, Schema } from 'mongoose';

interface IRole extends Document {
	_id: ObjectId;
	name: string;
}

const RoleSchema: Schema<IRole> = new mongoose.Schema({
	_id: { type: String, required: true },
	name: { type: String, required: true },
});

export const Role: Model<IRole> = mongoose.model<IRole>('roles', RoleSchema);
