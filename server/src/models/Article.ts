import mongoose, { Model, Schema, Types } from 'mongoose';

export interface IArticle extends Document {
	author: Types.ObjectId;
	title: string;
	content: string;
	readyForReview: boolean;
	reviewers: Types.ObjectId[];
	isAccepted: boolean;
}

const ArticleSchema: Schema<IArticle> = new mongoose.Schema({
	author: { type: Schema.Types.ObjectId, required: true },
	title: { type: String, required: true },
	content: { type: String, required: false },
	readyForReview: { type: Boolean, required: true },
	reviewers: { type: [Schema.Types.ObjectId], required: true },
	isAccepted: { type: Boolean, required: true },
});

export const Article: Model<IArticle> = mongoose.model<IArticle>('articles', ArticleSchema);
