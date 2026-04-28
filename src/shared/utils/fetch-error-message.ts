const fetchErrorMessage = async (
  response: Response,
  fallbackMessage: string,
) => {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

export default fetchErrorMessage;
