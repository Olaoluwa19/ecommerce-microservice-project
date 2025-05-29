var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ErrorResponse, SuccessResponse } from "../utility/response.js";
import { UserRepository } from "../repository/userRepository.js";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/Signupinput.js";
import { AppValidationError } from "../utility/errors.js";
import { GetSalt, GetHashedPassword, } from "../utility/password.js";
let UserService = class UserService {
    constructor(repository) {
        this.repository = repository;
    }
    // User creation, validation and login.
    async CreateUser(event) {
        try {
            const input = plainToClass(SignupInput, event.body);
            const error = await AppValidationError(input);
            if (error)
                return ErrorResponse(404, error);
            const salt = await GetSalt();
            const hashedPassword = await GetHashedPassword(input.password, salt);
            const data = await this.repository.createAccount({
                email: input.email,
                password: hashedPassword,
                phone: input.phone,
                userType: "BUYER",
                salt: salt,
            });
            return SuccessResponse(data);
        }
        catch (error) {
            console.log(error);
            return ErrorResponse(500, error);
        }
    }
    async UserLogin(event) {
        return SuccessResponse({ message: "response from User Login" });
    }
    async VerifyUser(event) {
        return SuccessResponse({ message: "response from Verify User" });
    }
    // User profile
    async CreateProfile(event) {
        return SuccessResponse({ message: "response from User Profile" });
    }
    async EditProfile(event) {
        return SuccessResponse({ message: "response from Edit User Profile" });
    }
    async GetProfile(event) {
        return SuccessResponse({ message: "response from Get User Profile" });
    }
    // Cart Section
    async CreateCart(event) {
        return SuccessResponse({ message: "response from Create Cart" });
    }
    async UpdateCart(event) {
        return SuccessResponse({ message: "response from Update Cart" });
    }
    async GetCart(event) {
        return SuccessResponse({ message: "response from Get Cart" });
    }
    // Payment Section
    async CreatePaymentMethod(event) {
        return SuccessResponse({ message: "response from Create Payment Method" });
    }
    async UpdatePaymentMethod(event) {
        return SuccessResponse({ message: "response from Update Payment Method" });
    }
    async GetPaymentMethod(event) {
        return SuccessResponse({ message: "response from Get Payment Method" });
    }
};
UserService = __decorate([
    autoInjectable(),
    __metadata("design:paramtypes", [UserRepository])
], UserService);
export { UserService };
//# sourceMappingURL=userService.js.map