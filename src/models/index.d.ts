import {
  ModelInit,
  MutableModel,
  __modelMeta__,
  ManagedIdentifier,
} from "@aws-amplify/datastore";
// @ts-ignore
import {
  LazyLoading,
  LazyLoadingDisabled,
  AsyncCollection,
} from "@aws-amplify/datastore";

type EagerTimeslot = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Timeslot, "id">;
    readOnlyFields: "createdAt" | "updatedAt";
  };
  readonly id: string;
  readonly startTime?: string | null;
  readonly endTime?: string | null;
  readonly unavailableDates?: (string | null)[] | null;
  readonly bookings?: (Booking | null)[] | null;
  readonly availableSundays?: (string | null)[] | null;
  readonly riderUnavailableDates?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyTimeslot = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Timeslot, "id">;
    readOnlyFields: "createdAt" | "updatedAt";
  };
  readonly id: string;
  readonly startTime?: string | null;
  readonly endTime?: string | null;
  readonly unavailableDates?: (string | null)[] | null;
  readonly bookings: AsyncCollection<Booking>;
  readonly availableSundays?: (string | null)[] | null;
  readonly riderUnavailableDates?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Timeslot = LazyLoading extends LazyLoadingDisabled
  ? EagerTimeslot
  : LazyTimeslot;

export declare const Timeslot: (new (init: ModelInit<Timeslot>) => Timeslot) & {
  copyOf(
    source: Timeslot,
    mutator: (draft: MutableModel<Timeslot>) => MutableModel<Timeslot> | void
  ): Timeslot;
};

type EagerBooking = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Booking, "id">;
    readOnlyFields: "createdAt" | "updatedAt";
  };
  readonly id: string;
  readonly title?: string | null;
  readonly date?: string | null;
  readonly description?: string | null;
  readonly timeslotID: string;
  readonly userID: string;
  readonly userType?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyBooking = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Booking, "id">;
    readOnlyFields: "createdAt" | "updatedAt";
  };
  readonly id: string;
  readonly title?: string | null;
  readonly date?: string | null;
  readonly description?: string | null;
  readonly timeslotID: string;
  readonly userID: string;
  readonly userType?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Booking = LazyLoading extends LazyLoadingDisabled
  ? EagerBooking
  : LazyBooking;

export declare const Booking: (new (init: ModelInit<Booking>) => Booking) & {
  copyOf(
    source: Booking,
    mutator: (draft: MutableModel<Booking>) => MutableModel<Booking> | void
  ): Booking;
};

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, "id">;
    readOnlyFields: "createdAt" | "updatedAt";
  };
  readonly id: string;
  readonly userName?: string | null;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly userType?: string | null;
  readonly bookings?: (Booking | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, "id">;
    readOnlyFields: "createdAt" | "updatedAt";
  };
  readonly id: string;
  readonly userName?: string | null;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly userType?: string | null;
  readonly bookings: AsyncCollection<Booking>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type User = LazyLoading extends LazyLoadingDisabled
  ? EagerUser
  : LazyUser;

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(
    source: User,
    mutator: (draft: MutableModel<User>) => MutableModel<User> | void
  ): User;
};
