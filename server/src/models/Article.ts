import mongoose, { Model, ObjectId, Schema } from 'mongoose';

interface IArticle extends Document {
	author: ObjectId;
	title: string;
	content: string;
	readyForReview: boolean;
	reviewers: ObjectId[];
	isAccepted: boolean;
}

const ArticleSchema: Schema<IArticle> = new mongoose.Schema({
	author: { type: String, required: true },
	title: { type: String, required: true },
	content: { type: String, required: false },
	readyForReview: { type: Boolean, required: true },
	reviewers: { type: [String], required: true },
	isAccepted: { type: Boolean, required: true },
});

export const Article: Model<IArticle> = mongoose.model<IArticle>('articles', ArticleSchema);
