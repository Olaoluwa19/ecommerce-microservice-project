import { validate } from "class-validator";
export const AppValidationError = async (input) => {
    const error = await validate(input, {
        ValidationError: { target: true },
    });
    if (error.length) {
        return error;
    }
    return false;
};
//# sourceMappingURL=errors.js.map