import { Router } from "express";
import { ReportsController } from "./ReportsController";
import auth from "../../middleware/auth";
import validateApiKey from "../../middleware/validateApiKey";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const reportsController = new ReportsController();

    router.get(
      "/users/adults",
      validateApiKey,
      auth,
      reportsController.getAdultUsers
    );

    router.get(
      "/users/gender/:gender",
      validateApiKey,
      auth,
      reportsController.getUsersByGender
    );

    router.get(
      "/users",
      validateApiKey,
      auth,
      reportsController.getPaginatedUsers
    );

    return router;
  }
}
