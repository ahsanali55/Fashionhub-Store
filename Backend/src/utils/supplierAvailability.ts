import User from "../models/user.model";

export const getActiveApprovedSupplierIds = async () => {
  const suppliers = await User.find({
    role: "supplier",
    status: "approved",
    isActive: true,
  }).select("_id");

  return suppliers.map((supplier) => supplier._id);
};
