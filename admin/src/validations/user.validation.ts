import Joi from "joi";

export const updateUserValidation = Joi.object({
  name: Joi.string().min(1).max(50).trim(),
  email: Joi.string().email().min(9).max(50).lowercase().trim(),
  password: Joi.string().min(5).max(50),
  dateOfBirth: Joi.date(),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").uppercase(),
});
