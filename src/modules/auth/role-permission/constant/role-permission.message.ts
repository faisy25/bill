export class MRolePermission {
  static readonly Error = {
    AlreadyActive: () => `RolePermission association is already active.`,
    AlreadyDeleted: (roleId: string, permissionId: string) =>
      `RolePermission association for roleId: ${roleId}, permissionId: ${permissionId} is already marked as deleted.`,
  } as const;

  static readonly Success = {
    Activated: () => `RolePermission association activated successfully.`,
    Deactivated: () => `RolePermission association deactivated successfully.`,
  } as const;
}
