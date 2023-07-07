// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Timeslot, Booking, User } = initSchema(schema);

export {
  Timeslot,
  Booking,
  User
};