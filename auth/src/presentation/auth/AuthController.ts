import { Request, Response } from "express";
import { UserModel } from "../../data/models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomRequest from "../../dtos/auth";

export class AuthController {

  register = async (req: Request, res: Response) => {
    const { name, email, password, dateOfBirth, gender } = req.body;

    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) 
        return res.status(409).send(">>> [AUTH SERVICE] User already exists");

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        dateOfBirth,
        gender
      });

      const { password: _, ...userWithoutPassword } = newUser.toObject();

      return res.status(201).send(userWithoutPassword);
    } catch (error) {
      console.error(">>> [AUTH SERVICE] Error registering new user:", error);
      return res.status(500).send(">>> [AUTH SERVICE] Server error");
    }
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email });

      if (!user) 
        return res.status(401).json({ message: '>>> [AUTH SERVICE] Invalid credentials' });

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) 
        return res.status(401).json({ message: '>>> [AUTH SERVICE] Invalid credentials' });
      

      const payload = {
        id: user._id,
        email: user.email,
        name: user.name
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string);

      return res.status(200).json({ token });
    } catch (error) {
      console.error(">>> [AUTH SERVICE] Error during login:", error);
      return res.status(500).json({ message: '>>> [AUTH SERVICE] Server error' });
    }
  }

  me = async (req: CustomRequest, res: Response) => {
    try {
      const userEmail = req.user.email;

      if (!userEmail) 
        return res.status(400).json({ message: "[AUTH SERVICE] User email not found in token" });
      
      const user = await UserModel.findOne({ email: userEmail }).select("-password");

      if (!user) 
        return res.status(404).json({ message: "[AUTH SERVICE] User not found" });

      return res.status(200).json(user);
    } catch (error) {
      console.error(">>> [AUTH SERVICE] Error in /me:", error);
      return res.status(500).json({ message: ">>> [AUTH SERVICE] Server error" });
    }
  };

  changePassword = async (req: CustomRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userEmail = req.user.email;

    try {
      const user = await UserModel.findOne({ email: userEmail });

      if (!user) 
        return res.status(404).json({ message: ">>> [AUTH SERVICE] User not found" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) 
        return res.status(400).json({ message: ">>> [AUTH SERVICE] Current password is incorrect" });
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;

      await user.save();

      return res.status(200).json({ message: ">>> [AUTH SERVICE] Password updated successfully" });
    } catch (error) {
      console.error(">>> [AUTH SERVICE] Error changing password:", error);
      return res.status(500).json({ message: ">>> [AUTH SERVICE] Server error" });
    }
  };

}