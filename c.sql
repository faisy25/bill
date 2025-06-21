-- BOOK TABLE
CREATE TABLE IF NOT EXISTS public."Book" (
    "bookId" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "author" INTEGER,
    "genre" INTEGER,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "review" DECIMAL,  -- Optional: average review score
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_book_author FOREIGN KEY ("author") REFERENCES public."User" ("userId") ON DELETE SET NULL,
    CONSTRAINT fk_book_genre FOREIGN KEY ("genre") REFERENCES public."Genre" ("genreId") ON DELETE SET NULL
);

-- GENRE TABLE
CREATE TABLE IF NOT EXISTS public."Genre" (
    "genreId" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);

-- BOOK REVIEW TABLE
CREATE TABLE IF NOT EXISTS public."BookReview" (
    "reviewId" SERIAL PRIMARY KEY,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" DECIMAL NOT NULL CHECK ("rating" >= 0 AND "rating" <= 5),
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_book FOREIGN KEY ("bookId") REFERENCES public."Book" ("bookId") ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY ("userId") REFERENCES public."User" ("userId") ON DELETE CASCADE
);

-- USER TABLE
-- Make sure this sequence is created beforehand, or use SERIAL instead
CREATE SEQUENCE IF NOT EXISTS "User_userId_seq";

CREATE TABLE IF NOT EXISTS public."User" (
    "userId" INTEGER NOT NULL DEFAULT nextval('"User_userId_seq"'::regclass),
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    "roleId" VARCHAR(6) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_pkey" PRIMARY KEY ("userId"),
    CONSTRAINT "User_username_key" UNIQUE (username),
    CONSTRAINT fk_user_role FOREIGN KEY ("roleId")
        REFERENCES public."Role" ("roleId") ON UPDATE CASCADE ON DELETE RESTRICT
);
