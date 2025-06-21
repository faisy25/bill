import { z } from "zod";

export const createBookSchema = z
  .object({
    title: z.string().min(1, "Title cannot be empty"),
    description: z.string().optional(),
    genre: z.number().min(1, "Genre cannot be empty"),
    publishDate: z.string().min(10, "Publish date cannot be empty"),
  })
  .strict();

export const updateBookSchema = z
  .object({
    title: z.string().min(1, "Title cannot be empty").optional(),
    description: z.string().optional(),
    genre: z.number().min(1, "Genre cannot be empty").optional(),
    publishDate: z.string().min(10, "Publish date cannot be empty").optional(),
  })
  .strict()
  .partial();

export const getBooksQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  author: z.string().optional(),
  genre: z.string().optional(),
});

export const createBookReviewSchema = z
  .object({
    rating: z.number().min(1, "Rating cannot be empty").max(5),
    comments: z.string().optional(),
  })
  .strict();

export const updateBookReviewSchema = z
  .object({
    rating: z.number().min(1, "Rating cannot be empty").max(5).optional(),
    comments: z.string().optional(),
  })
  .strict()
  .partial();
