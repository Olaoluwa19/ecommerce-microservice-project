import bcrypt from "bcrypt";
export const GetSalt = async () => {
    return await bcrypt.genSalt();
};
export const GetHashedPassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};
export const ValidatePassword = async (enteredPassword, savedPassword, salt) => {
    return (await GetHashedPassword(enteredPassword, salt)) === savedPassword;
};
//# sourceMappingURL=password.js.map