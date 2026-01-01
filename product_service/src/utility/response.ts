import { ValidationError } from "class-validator";

const formatResponse = (
  statusCode: number,
  message: string,
  data?: unknown
) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,x-api-key,x-requested-with",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE,PATCH",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message,
    ...(data !== undefined && { data }),
  }),
});

// Success responses
export const SuccessResponse = (data: object, statusCode = 200) => {
  return formatResponse(statusCode, "Success", data);
};

export const CreatedResponse = (data: object) => {
  return SuccessResponse(data, 201);
};

// Error responses
export const ErrorResponse = (statusCode: number, error: unknown) => {
  // Handle class-validator errors properly
  if (
    Array.isArray(error) &&
    error.every((e): e is ValidationError => e instanceof ValidationError)
  ) {
    const formattedErrors = error.map((err) => ({
      field: err.property,
      value: err.value,
      constraints: err.constraints,
    }));

    return formatResponse(statusCode, "Validation failed", formattedErrors);
  }

  // Handle regular Error objects
  if (error instanceof Error) {
    return formatResponse(statusCode, error.message);
  }

  // Fallback
  const message =
    typeof error === "string" ? error : "An unexpected error occurred";
  return formatResponse(statusCode, message);
};

// Convenience wrappers
export const BadRequest = (error: unknown) => {
  console.log("Bad request error:", error);
  return ErrorResponse(400, error);
};
export const NotFound = (message = "Resource not found") =>
  ErrorResponse(404, message);
export const Unauthorized = (message = "Unauthorized") =>
  ErrorResponse(401, message);
export const InternalError = (error?: unknown) => {
  console.log("Internal server error:", error);
  return ErrorResponse(500, error || "Internal server error");
};
