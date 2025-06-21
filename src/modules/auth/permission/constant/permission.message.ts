export class MPermission {
  static readonly Error = {
    DeleteRoleConflict: () =>
      `Cannot delete permission. It is currently assigned to one or more roles.`,
  } as const;

  static readonly Success = {} as const;
}
