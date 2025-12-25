import {
  BadRequest,
  CreatedResponse,
  InternalError,
} from "app/utility/response.js";
import { AddressModel } from "../models/AddressModel.js";
import { PaymentModel } from "../models/PaymentModel.js";
import { ProfileInput } from "../models/dto/AddressInput.js";
const { DBOperation } = await import("./dbOperation.js");

export class PaymentRepository extends DBOperation {
  constructor() {
    super();
  }
}
