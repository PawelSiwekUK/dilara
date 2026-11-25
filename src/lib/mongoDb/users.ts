import "server-only";

import mongoose, { Schema, type Model, type Types } from "mongoose";

import { userRoles } from "./users-schema.mjs";

export type UserRole = (typeof userRoles)[number];

export type User = {
  _id: Types.ObjectId;
  email: string;
  name?: string;
  role: UserRole;
  emailVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 254,
      match: /^[^\s@]+@[^\s@]+$/,
    },
    name: { type: String, minlength: 1 },
    role: { type: String, required: true, enum: userRoles },
    emailVerifiedAt: { type: Date },
  },
  {
    collection: "users",
    timestamps: true,
    versionKey: false,
    strict: "throw",
    autoCreate: false,
    autoIndex: false,
    bufferCommands: false,
  },
);

userSchema.index(
  { email: 1 },
  { name: "users_email_unique", unique: true, collation: { locale: "en", strength: 2 } },
);

export const UserModel: Model<User> =
  mongoose.models.User ?? mongoose.model<User>("User", userSchema);
