import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/admin/overview
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection("user");
    const tasksCollection = db.collection("tasks");
    const paymentCollection = db.collection("payment");

    const [users, tasks, payments] = await Promise.all([
      usersCollection.find({}, { projection: { password: 0 } }).toArray(),
      tasksCollection.find({}).sort({ createdAt: -1 }).toArray(),
      paymentCollection.find({}).toArray(),
    ]);

    const proposalStats = {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
    };

    tasks.forEach((task) => {
      (task.proposals || []).forEach((proposal) => {
        proposalStats.total += 1;
        const status = String(proposal.status || "pending").toLowerCase();
        if (status === "accepted") proposalStats.accepted += 1;
        else if (status === "rejected") proposalStats.rejected += 1;
        else proposalStats.pending += 1;
      });
    });

    const paymentStats = {
      total: payments.length,
      volume: payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    };

    return NextResponse.json({
      success: true,
      users,
      tasks,
      payments: paymentStats,
      proposals: proposalStats,
      recentActivity: tasks.slice(0, 10),
    });
  } catch (error) {
    console.error("Error in Next.js GET /api/admin/overview:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch overview" },
      { status: 500 }
    );
  }
}
