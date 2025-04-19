export interface Article {
    id: string,
    author: string,
    title: string,
    content?: string,
    readyForReview: boolean,
    reviewers: string[],
    isAccepted?: boolean
}