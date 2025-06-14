import { Router } from "express";
import { AuthRoutes } from "./auth/AuthRoutes";

export class AppRoutes {

  static get routes() : Router {
    const router = Router();
    router.use("/api/auth", AuthRoutes.routes);

    return router;
  }
}
