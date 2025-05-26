import { UserModel } from "../models/UserModel.js";

export class UserRepository {
  constructor() {}

  async createAccount({ email, password, salt, phone, userType }: UserModel) {
    console.log("User created in DB");
  }
}
