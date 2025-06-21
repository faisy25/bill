import { capitalize } from "@src/utils/capitalize";

// CRUD Operation Failures
export class Error {
  static readonly Message = {
    Create: (resource: string) => `Failed to create ${resource.toLowerCase()}.`,
    Update: (resource: string) => `Failed to update ${resource.toLowerCase()}.`,
    Delete: (resource: string) => `Failed to delete ${resource.toLowerCase()}.`,
    Retrieve: (resource: string) =>
      `Failed to fetch ${resource.toLowerCase()}.`,

    // General Errors
    NotFound: (resource: string) => `${capitalize(resource)} not found.`,
    AlreadyExists: (resource: string) =>
      `${capitalize(resource)} already exists.`,
    Invalid: (resource: string) => `Invalid ${capitalize(resource)}.`,
    Unauthorized: () => `Unauthorized access.`,
    Forbidden: () => `Access denied.`,
    InternalServerError: () => `An unexpected internal error occurred.`,
  } as const;
}
