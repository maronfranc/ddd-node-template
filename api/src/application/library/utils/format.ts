export const addMissingSlashToPath = (path: string | undefined): string => {
  if (path === undefined || path === null) return '';
  return (path.startsWith('/')) ? path : `/${path}`;
}
