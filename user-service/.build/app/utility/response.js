const formatResponse = (statusCode, message, data) => {
    if (data) {
        return {
            statusCode,
            headers: {
                "Access-Control-Origin": "*",
            },
            body: JSON.stringify({
                message,
                data,
            }),
        };
    }
    else {
        return {
            statusCode,
            headers: {
                "Access-Control-Origin": "*",
            },
            body: JSON.stringify({
                message,
            }),
        };
    }
};
export const SuccessResponse = (data) => {
    return formatResponse(200, "Success", data);
};
export const ErrorResponse = (code = 1000, error) => {
    if (Array.isArray(error)) {
        const errorObject = error[0].constraints;
        const errorMessage = errorObject[Object.keys(errorObject)[0]] || "Error Occured";
        return formatResponse(code, errorMessage, errorMessage);
    }
    return formatResponse(code, `${error}`, error);
};
//# sourceMappingURL=response.js.map