import { Request, Response } from "express";
import { UserModel } from "../../data/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomRequest from "../../dtos/auth";

export class ReportsController {
  getAdultUsers = async (req: Request, res: Response) => {
    try {
      const today = new Date();
      const cutoffDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );

      const users = await UserModel.find({
        dateOfBirth: { $lte: cutoffDate },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error(">>> [ADMIN SERVICE] Error in getAdultUsers:", error);
      return res.status(500).json({
        message: ">>> [ADMIN SERVICE] Server error",
      });
    }
  };

  getUsersByGender = async (req: Request, res: Response) => {
    try {
      const genderParam = req.params.gender.toUpperCase();

      const allowedGenders = ['MALE', 'FEMALE', 'OTHER'];
      if (!allowedGenders.includes(genderParam)) {
        return res.status(400).json({
          message: `Invalid gender. Allowed values are: ${allowedGenders.join(', ')}`,
        });
      }

      const users = await UserModel.find({ gender: genderParam });

      return res.status(200).json(users);
    } catch (error) {
      console.error(">>> [ADMIN SERVICE] Error in getUsersByGender:", error);
      return res.status(500).json({
        message: ">>> [ADMIN SERVICE] Server error",
      });
    }
  };

  getPaginatedUsers = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        UserModel.find().skip(skip).limit(limit),
        UserModel.countDocuments(),
      ]);

      return res.status(200).json({
        totalUsers: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        users,
      });
    } catch (error) {
      console.error(">>> [ADMIN SERVICE] Error in getPaginatedUsers:", error);
      return res.status(500).json({
        message: ">>> [ADMIN SERVICE] Server error",
      });
    }
  };

}
