// app/container.ts
import { UserRepository } from "./repository/userRepository";
import { ShoppingCartRepository } from "./repository/cartRepository.js";
import { PaymentRepository } from "./repository/paymentRepository.js";
import { UserService } from "./service/userService.js";
import { CartService } from "./service/cartService.js";
import { PaymentService } from "./service/paymentService.js";

// Create single instances (reused across invocations in warm container)
const userRepository = new UserRepository();
const cartRepository = new ShoppingCartRepository();
const paymentRepository = new PaymentRepository();

const userService = new UserService(userRepository);
const cartService = new CartService(cartRepository);
const paymentService = new PaymentService(paymentRepository);

// Export them
export const container = {
  userService,
  cartService,
  paymentService,
  userRepository,
  cartRepository,
  paymentRepository,
} as const;
