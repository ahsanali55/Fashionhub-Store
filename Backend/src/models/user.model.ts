import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["customer", "supplier", "admin"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function (this: any) {
        return this.role === "supplier" ? "pending" : "approved";
      },
    },
    refreshToken: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
// Pre-save hook to hash the password before saving the user document
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Password comparison method to compare the provided password with the hashed password
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model<IUser>("User", userSchema);

export default User;
