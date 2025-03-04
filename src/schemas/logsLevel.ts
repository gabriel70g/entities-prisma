import Joi from "joi";

export const logLevelSchema = Joi.object({
    level: Joi.string()
      .valid("error", "warn", "info", "http", "verbose", "debug", "silly")
      .required()
  });