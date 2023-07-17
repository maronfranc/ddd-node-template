export const addMissingSlashToPath = (path: string): string => {
  return (path.startsWith('/')) ? path : `/${path}`;
}
