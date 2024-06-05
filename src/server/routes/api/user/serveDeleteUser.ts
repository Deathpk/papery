import mongoose from "mongoose";

import { dbDeleteUser } from "../../../db/user/dbDeleteUser";
import StripeHandler from "../../../modules/stripe/StripeHandler";
import { dbGetUserById } from "../../../db/user/dbGetUserById";

export async function serveDeleteUser(req: any, res: any) {
  const { userParmId } = req;
  console.log("🚀 ~ serveDeleteUser ~ userParmId:", userParmId);

  try {
    const user = await dbGetUserById(mongoose, { userParmId });

    // cancel subscription if exists
    if (user.subscriptionId) {
      await StripeHandler.cancelSubscription(user.subscriptionId);
    }

    // delete user
    await dbDeleteUser(mongoose, userParmId);

    return res.status(200).json({});
  } catch (error) {
    console.log("🚀 ~ serveDeleteUser ~ error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}
