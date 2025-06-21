import { capitalize } from "@src/utils/capitalize";

export class Success {
  static readonly Message = {
    Create: (resource: string) =>
      `${capitalize(resource)} created successfully.`,
    Update: (resource: string) =>
      `${capitalize(resource)} updated successfully.`,
    Delete: (resource: string) =>
      `${capitalize(resource)} deleted successfully.`,
    Retrieved: (resource: string) =>
      `${capitalize(resource)} fetched successfully.`,
  } as const;
}
