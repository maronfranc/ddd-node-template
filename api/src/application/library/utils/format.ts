export const addMissingSlashToPath = (path: string | undefined): string => {
  if (!path) return '';
  return (path.startsWith('/')) ? path : `/${path}`;
}
