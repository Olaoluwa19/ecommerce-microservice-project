import { ValidationError, validate } from "class-validator";

export const AppValidationError = async (
  input: any
): Promise<ValidationError[] | false> => {
  const error = await validate(input, {
    ValidationError: { target: true },
  });

  if (error.length) {
    console.log(error);
    return error;
  }
  console.log(error);
  return false;
};
