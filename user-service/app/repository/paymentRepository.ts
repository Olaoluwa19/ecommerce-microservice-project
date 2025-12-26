const { DBOperation } = await import("./dbOperation.js");

export class PaymentRepository extends DBOperation {
  constructor() {
    super();
  }
}
