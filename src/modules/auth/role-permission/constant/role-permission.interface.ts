export interface IAddRolePermissionRequestBody {
  roleId: string;
  permissionId: string;
}

export interface IDeleteRolePermissionRequestBody {
  roleId: string;
  permissionId: string;
}

export interface IGetAllRolePermissionsFilter {
  roleId?: string;
  permissionId?: string;
}

export interface IPermissionDetails {
  permissionId: string;
  name: string;
  description: string;
}

export interface IRoleDetails {
  roleId: string;
  name: string;
  description: string;
}

export interface IRolePermissionResponse {
  roleId: string;
  permissionId: string;
  isDeleted: boolean;
  permission?: IPermissionDetails;
  role?: IRoleDetails; // Optional: include role details for `getRolePermissions`
}
