import { Router } from "express";
import { UserController } from "./UserController";
import validateApiKey from "../../middleware/validateApiKey";
import auth from "../../middleware/auth";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const userController = new UserController();

    router.get(
      "",
      validateApiKey,
      auth,
      userController.getUsers
    );

    return router;
  }
}
