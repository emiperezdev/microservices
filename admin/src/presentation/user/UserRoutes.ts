import { Router } from "express";
import { UserController } from "./UserController";
import validateApiKey from "../../middleware/validateApiKey";
import auth from "../../middleware/auth";
import validateId from "../../middleware/validateId";
import validateBody from "../../middleware/validateBody";
import { updateUserValidation } from "../../validations/user.validation";

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

    router.get(
      "/:id",
      validateApiKey,
      auth,
      validateId,
      userController.getUserById
    );

    router.put(
      "/:id",
      validateApiKey,
      auth,
      validateId,
      validateBody(updateUserValidation),
      userController.updateUserById
    );

    router.delete(
      "/:id",
      validateApiKey,
      auth,
      validateId,
      userController.deleteUserById
    );

    return router;
  }
}
