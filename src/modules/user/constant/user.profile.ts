export const userOptions = {
  select: {
    userId: true,
    firstName: true,
    lastName: true,
    username: true,
    isActive: true,
    role: { select: { name: true } },
  },
};
