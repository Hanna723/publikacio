export interface Review {
    _id?: string,
    text: string,
    isAccepted: boolean,
    article: string,
    reviewer: string
}