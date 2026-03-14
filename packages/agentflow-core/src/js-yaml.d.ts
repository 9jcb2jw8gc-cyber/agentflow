declare module "js-yaml" {
  export function dump(obj: unknown, opts?: Record<string, unknown>): string;
  export function load(str: string, opts?: Record<string, unknown>): unknown;
}
