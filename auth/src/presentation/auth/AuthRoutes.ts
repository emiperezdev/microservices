import { Router } from "express";
import { AuthController } from "./AuthController";
import validateBody from "../../middleware/validateBody";
import {
  changePasswordValidation,
  loginValidation,
  registryValidation,
} from "../../validations/auth.validation";
import auth from "../../middleware/auth";
import validateApiKey from "../../middleware/validateApiKey";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const authController = new AuthController();

    router.post(
      "/register",
      validateApiKey,
      validateBody(registryValidation),
      authController.register
    );

    router.post(
      "/login",
      validateApiKey,
      validateBody(loginValidation),
      authController.login
    );

    router.get("/me", validateApiKey, auth, authController.me);

    router.post(
      "/change-password",
      auth,
      validateBody(changePasswordValidation),
      authController.changePassword
    );

    return router;
  }
}
