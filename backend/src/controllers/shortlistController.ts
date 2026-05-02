import Joi from "joi";
import { rankCars } from "../services/scoringService";

const schema = Joi.object({
  budget: Joi.number().optional(),
  fuel: Joi.string()
    .valid("Petrol", "Diesel", "EV", "Any")
    .optional(),
  usage: Joi.string()
    .valid("city", "highway", "family")
    .optional(),
  priority: Joi.string()
    .valid("safety", "mileage", "boot")
    .optional(),
});

export const shortlistController = async (
  request: any,
  h: any
) => {
  const { error, value } = schema.validate(request.payload);

  if (error) {
    return h
      .response({
        error: error.message,
      })
      .code(400);
  }

  const result = await rankCars(value);

  return h.response(result).code(200);
};

export const getAllCarsController = async (
  request: any,
  h: any
) => {
  const cars = await rankCars();

  return h.response(cars).code(200);
};