import Joi from 'joi';

const EventPayloadSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  type: Joi.string().required(),
  caption: Joi.string().required(),
  startTime: Joi.string().required(),
  fee: Joi.number().required(),
  endTime: Joi.string().required(),
  contactPersons: Joi.string().required(),
  banner: Joi.object().required(),
  link: Joi.string().required(),
});

export {
  EventPayloadSchema,
};
