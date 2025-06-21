export class MAuth {
  static readonly Error = {
    InActive: () => `User is not active`,
    Invalid: () => `Invalid username or password`,
    Login: () => `User logged in failed.`,
    Logout: () => `User logged out failed.`,
    Register: () => `User registration failed.`,
  } as const;

  static readonly Success = {
    Login: () => `User logged in successfully.`,
    Logout: () => `User logged out successfully.`,
    Register: () => `User registered successfully.`,
  } as const;
}
