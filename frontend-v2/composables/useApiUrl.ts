export const useBaseApiUrl = (): string => {
  const { apiUrl } = useRuntimeConfig().public;
  return apiUrl;
};

export const useApiUrl = (): string => {
  const { apiVersion } = useRuntimeConfig().public;
  const baseUrl = useBaseApiUrl();
  return `${baseUrl}/${apiVersion}`;
};
