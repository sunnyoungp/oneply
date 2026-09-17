let n = 0;

export function uid(prefix: string): string {
  n += 1;
  return `${prefix}-${Date.now().toString(36)}-${n.toString(36)}`;
}

export function resetIds(): void {
  n = 0;
}
