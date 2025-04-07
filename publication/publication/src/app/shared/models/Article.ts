export interface Article {
    id: string,
    author: string,
    title: string,
    content: string,
    reviewers: string[],
    isAccepted: boolean
}