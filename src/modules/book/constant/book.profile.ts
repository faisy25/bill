export const bookProfile = {
  authorInfo: {
    select: {
      firstName: true,
      lastName: true,
      username: true,
      roleId: true,
    },
  },
  genreInfo: {
    select: {
      name: true,
    },
  },
  // bookReview: {
  //   where: {
  //     isDeleted: false,
  //   },
  //   select: {
  //     rating: true,
  //     comments: true,
  //     userInfo: {
  //       select: {
  //         username: true,
  //       },
  //     },
  //   },
  // },
};

export const bookReviewProfile = {
  userInfo: {
    select: {
      firstName: true,
      lastName: true,
      username: true,
      roleId: true,
    },
  },
};
