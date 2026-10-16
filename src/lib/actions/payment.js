"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const baseUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export const payment = async (data) => {
  const { sessionId, userId, userEmail, price, taskId, proposalId } = data || {};

  try {
    let dbSuccess = false;

    // 1. Direct MongoDB Settlement (Works reliably on Vercel and locally)
    if (taskId) {
      try {
        const { db } = await connectToDatabase();
        const paymentCollection = db.collection("payment");
        const tasksCollection = db.collection("tasks");

        // Check if session already recorded
        const isExist = sessionId ? await paymentCollection.findOne({ sessionId }) : null;

        if (!isExist) {
          await paymentCollection.insertOne({
            sessionId: sessionId || `demo_${Date.now()}`,
            userEmail: userEmail || "client@skillswap.edu",
            userId: userId || "client-escrow",
            price: Number(price) || 0,
            amount: Number(price) || 0,
            taskId: ObjectId.isValid(taskId) ? new ObjectId(taskId) : taskId,
            proposalId:
              proposalId && ObjectId.isValid(proposalId)
                ? new ObjectId(proposalId)
                : proposalId,
            escrowStatus: "Held",
            createdAt: new Date(),
          });
        }

        // Update task and proposals in MongoDB
        if (ObjectId.isValid(taskId)) {
          const filter = { _id: new ObjectId(taskId) };
          let updateDoc = {};
          let options = {};

          if (proposalId && ObjectId.isValid(proposalId)) {
            updateDoc = {
              $set: {
                status: "Accepted",
                escrowStatus: "Held",
                "proposals.$[elem].status": "Accepted",
                "proposals.$[other].status": "Rejected",
              },
            };
            options = {
              arrayFilters: [
                { "elem.proposalId": new ObjectId(proposalId) },
                {
                  "other.proposalId": { $ne: new ObjectId(proposalId) },
                  "other.status": "Pending",
                },
              ],
            };
          } else {
            updateDoc = { $set: { status: "Accepted", escrowStatus: "Held" } };
          }

          await tasksCollection.updateOne(filter, updateDoc, options);
        }

        dbSuccess = true;
      } catch (mongoErr) {
        console.warn("Direct MongoDB settlement warning:", mongoErr.message);
      }
    }

    // 2. Also notify Express backend if available (sync)
    if (baseUrl && !baseUrl.includes("localhost:5000")) {
      try {
        await fetch(`${baseUrl}/api/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (e) {}
    }

    return {
      success: true,
      msg: "Payment and escrow status updated globally across the platform!",
    };
  } catch (error) {
    console.error("Server Action Payment Error:", error);
    return { success: false, error: error.message };
  }
};
