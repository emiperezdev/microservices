import { Request, Response } from "express";
import { UserModel } from "../../data/model/user.model";
import bcrypt from "bcrypt";

export class UserController {
  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find();

      return res.status(200).json(users);
    } catch (error) {
      console.error(">>> [ADMIN SERVICE] Error in getUsers:", error);
      return res
        .status(500)
        .json({ message: ">>> [ADMIN SERVICE] Server error" });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const currentUser = await UserModel.findById(id);
      if (!currentUser)
        return res
          .status(404)
          .send(`>>> [ADMIN SERVICE] No user found with the given id: ` + id);

      const { password, ...userWithoutPassword } = currentUser.toObject();

      return res.send(userWithoutPassword);
    } catch (error) {
      console.error(">>> [ADMIN SERVICE] Error in getUserById:", error);
      return res
        .status(500)
        .json({ message: ">>> [ADMIN SERVICE] Server error" });
    }
  };

  deleteUserById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const currentUser = await UserModel.findById(id);
      if (!currentUser)
        return res
          .status(404)
          .send(`>>> [ADMIN SERVICE] No user found with the given id: ${id}`);

      await UserModel.findByIdAndDelete(id);
      res.send(currentUser);
    } catch (error) {
      console.error(">>> [ADMIN SERVICE] Error in deleteUserById:", error);
      return res
        .status(500)
        .json({ message: ">>> [ADMIN SERVICE] Server error" });
    }
  };

  updateUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password, dateOfBirth, gender } = req.body;

    try {
      const user = await UserModel.findById(id);
      if (!user)
        return res.status(404).send(">>> [ADMIN SERVICE] User not found");

      let hashedPassword;
      if (password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
      }

      user.name = name ?? user.name;
      user.email = email ?? user.email;
      user.dateOfBirth = dateOfBirth ?? user.dateOfBirth;
      user.gender = gender ?? user.gender;
      if (hashedPassword) user.password = hashedPassword;

      await user.save();

      const { password: _, ...userWithoutPassword } = user.toObject();
      return res.status(200).send(userWithoutPassword);
    } catch (error) {
      console.error(">>> [ADMIN SERVICE] Error updating user:", error);
      return res.status(500).send(">>> [ADMIN SERVICE] Server error");
    }
  };
}
