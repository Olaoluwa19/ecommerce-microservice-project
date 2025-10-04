const formatResponse = (
  statusCode: number,
  message: string,
  data?: unknown
) => {
  const response = {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*", // Corrected header name
      "Content-Type": "application/json", // Explicitly set Content-Type
      "Access-Control-Allow-Headers": "Content-Type", // Optional: for CORS
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Optional: for CORS
    },
    body: JSON.stringify({
      message,
      ...(data && { data }), // Conditionally include data if provided
    }),
  };
  return response;
};

export default formatResponse;
export const SuccessResponse = (data: object) => {
  return formatResponse(200, "Success", data);
};

export const ErrorResponse = (code = 1000, error: unknown) => {
  if (Array.isArray(error)) {
    const errorObject = error[0].constraints;
    const errorMessage =
      errorObject[Object.keys(errorObject)[0]] || "Error Occured";
    console.log(error);
    return formatResponse(code, errorMessage, errorMessage);
  }
  console.log(error);
  return formatResponse(code, `${error}`, error);
};
