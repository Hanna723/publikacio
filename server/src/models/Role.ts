import mongoose, { Model, Schema, Types } from 'mongoose';

interface IRole extends Document {
	_id: Types.ObjectId;
	name: string;
}

const RoleSchema: Schema<IRole> = new mongoose.Schema({
	_id: { type: Schema.Types.ObjectId, required: true },
	name: { type: String, required: true },
});

export const Role: Model<IRole> = mongoose.model<IRole>('roles', RoleSchema);
