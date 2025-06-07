import { Router } from "express";
import { UserRoutes } from "./user/UserRoutes";

export class AppRoutes {

  static get routes() : Router {
    const router = Router();
    router.use("/api/users", UserRoutes.routes);

    return router;
  }
}
