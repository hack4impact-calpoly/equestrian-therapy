// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Timeslot, Event, User } = initSchema(schema);

export {
  Timeslot,
  Event,
  User
};