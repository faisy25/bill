export interface ICreateBookRequestBody {
  title: string;
  description?: string;
  genre: number;
  publishDate: Date;
}

export interface IUpdateBookRequestBody {
  title: string;
  description?: string;
  genre: number;
  publishDate: Date;
}

export interface IGetBooksQuery {
  page?: number;
  limit?: number;
  author?: number;
  genre?: number;
}

export interface ICreateBookReviewRequestBody {
  rating: number;
  comments?: string;
}

export interface IUpdateBookReviewRequestBody {
  rating?: number;
  comments?: string;
}

export interface IGetBookReviewsQuery {
  bookId: number; // The ID of the book
  page?: number;
  limit?: number;
}
