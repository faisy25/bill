export interface ICreateRoleRequestBody {
  roleId: string;
  name: string;
  description?: string;
}

export interface IUpdateRoleRequestBody {
  roleId?: string;
  name?: string;
  description?: string;
}
