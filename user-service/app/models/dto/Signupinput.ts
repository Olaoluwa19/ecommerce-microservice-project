import { Length } from "class-validator";
import { LoginInput } from "./LoginInput.js";

export class SignupInput extends LoginInput {
  @Length(10, 14)
  phone: string;
  first_name: string;
  last_name: string;
}
