import { Length } from "class-validator";
import { LoginInput } from "./Logininput.js";

export class SignupInput extends LoginInput {
  @Length(10, 13)
  phone: string;
}
