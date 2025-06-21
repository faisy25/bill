export class MRole {
  static readonly Error = {
    DeleteUserConflict: () =>
      `Cannot delete role. Users are still assigned to this role.`,
  } as const;

  static readonly Success = {} as const;
}
