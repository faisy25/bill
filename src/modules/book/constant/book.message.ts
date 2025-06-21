export class MBook {
  static readonly Error = {
    AlreadyReviewed: `You have already reviewed this book.`,
  } as const;

  static readonly Success = {} as const;
}
