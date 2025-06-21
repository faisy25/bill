// src/modules/auth/auth.interfaces.ts (or wherever you keep your interfaces)

export interface IRegisterRequestBody {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  roleId: string;
}

// For login if needed
export interface ILoginRequestBody {
  username: string;
  password: string;
}
