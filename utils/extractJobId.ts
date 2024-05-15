/**
 * Extracts the job ID from the externalPath and matches it with the bulletFields array.
 * @param externalPath - The external path containing the job ID.
 * @param bulletFields - The array of bullet fields containing potential job IDs.
 * @returns The matched job ID or null if no match is found.
 */
export const extractJobId = (
  externalPath: string,
  bulletFields: string[]
): string | null => {
  const match = externalPath.match(/_([^/]+)$/);

  if (!match) return null;

  // Remove any trailing -X suffixes (e.g., -1)
  let jobIdFromPath = match[1];
  jobIdFromPath = jobIdFromPath.replace(/-\d+$/, '');

  const matchedJobId = bulletFields.find((field) =>
    field.includes(jobIdFromPath)
  );

  return matchedJobId || null;
};
