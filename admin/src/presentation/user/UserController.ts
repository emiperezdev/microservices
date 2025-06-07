import { Request, Response } from "express";
import { UserModel } from "../../data/model/user.model";

export class UserController {

  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find();

      return res.status(200).json(users);
    } catch (error) {
      console.error(">>> [ADMIN SERVICE] Error in getUsers:", error);
      return res.status(500).json({ message: ">>> [ADMIN SERVICE] Server error" });
    }
  };

}
