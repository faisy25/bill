export interface IUpdateUserRequestBody {
  firstName?: string;
  lastName?: string;
  username?: string;
  isActive?: boolean;
  roleId?: string; // Only if you allow role changes directly
}
