export const roleOptions = {
  include: {
    _count: {
      select: { users: true, role_permission: true },
    },
    role_permission: {
      select: { permission: { select: { name: true } } },
    },
  },
};
