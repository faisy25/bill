export interface ICreatePermissionRequestBody {
  permissionId: string;
  name: string; // e.g., "user:read", "role:create"
  description: string;
}

export interface IUpdatePermissionRequestBody {
  permissionId?: string;
  name?: string;
  description?: string;
}
