import Joi from "joi";

export const loginValidation = Joi.object({
  email: Joi.string().email().min(9).max(50).lowercase().trim().required(),
  password: Joi.string().min(5).max(50).required(),
});

export const registryValidation = Joi.object({
  name: Joi.string().min(1).max(50).trim().required(),
  email: Joi.string().email().min(9).max(50).lowercase().trim().required(),
  password: Joi.string().min(5).max(50).required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").uppercase().required(),
});

export const changePasswordValidation = Joi.object({
  currentPassword: Joi.string().min(5).max(50).required(),
  newPassword: Joi.string().min(5).max(50).required(),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});
