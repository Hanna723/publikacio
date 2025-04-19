import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IReview extends Document {
	text: string;
	isAccepted: boolean;
	article: Types.ObjectId;
	reviewer: Types.ObjectId;
}

const ReviewSchema: Schema<IReview> = new mongoose.Schema({
	text: { type: String, required: true },
	isAccepted: { type: Boolean, required: true },
	article: { type: Schema.Types.ObjectId, required: true },
	reviewer: { type: Schema.Types.ObjectId, required: true },
});

export const Review: Model<IReview> = mongoose.model<IReview>(
	'reviews',
	ReviewSchema
);
