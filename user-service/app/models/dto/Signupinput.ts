import { Length } from "class-validator";
import { LoginInput } from "./Logininput.js";

export class SignupInput extends LoginInput {
  @Length(10, 14)
  phone: string;
}
