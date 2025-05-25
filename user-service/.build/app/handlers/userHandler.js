import "reflect-metadata";
import { container } from "tsyringe";
import { UserService } from "../service/userService.js";
import { ErrorResponse } from "../utility/response.js";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
// Register UserRepository with the container
// container.register(UserRepository, { useClass: UserRepository });
const service = container.resolve(UserService);
export const Signup = middy(async (event) => {
    return service.CreateUser(event);
}).use(bodyParser());
export const Login = async (event) => {
    return service.UserLogin(event);
};
export const Verify = async (event) => {
    return service.VerifyUser(event);
};
export const Profile = async (event) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if (httpMethod === "post") {
        return service.CreateProfile(event);
    }
    else if (httpMethod === "put") {
        return service.EditProfile(event);
    }
    else if (httpMethod === "get") {
        return service.GetProfile(event);
    }
    else {
        return ErrorResponse(404, "request Method is not supported!");
    }
};
export const Cart = async (event) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if (httpMethod === "post") {
        return service.CreateCart(event);
    }
    else if (httpMethod === "put") {
        return service.UpdateCart(event);
    }
    else if (httpMethod === "get") {
        return service.GetCart(event);
    }
    else {
        return ErrorResponse(404, "request Method is not supported!");
    }
};
export const Payment = async (event) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if (httpMethod === "post") {
        return service.CreatePaymentMethod(event);
    }
    else if (httpMethod === "put") {
        return service.UpdatePaymentMethod(event);
    }
    else if (httpMethod === "get") {
        return service.GetPaymentMethod(event);
    }
    else {
        return ErrorResponse(404, "request Method is not supported!");
    }
};
//# sourceMappingURL=userHandler.js.map