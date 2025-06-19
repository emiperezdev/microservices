import { Router } from "express";
import { AuthRoutes } from "./reports/ReportsRoutes";

export class AppRoutes {

  static get routes() : Router {
    const router = Router();
    router.use("/api/reports", AuthRoutes.routes);

    return router;
  }
}
