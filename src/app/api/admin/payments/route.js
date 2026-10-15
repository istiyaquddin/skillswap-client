import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/admin/payments
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const paymentCollection = db.collection("payment");
    const tasksCollection = db.collection("tasks");

    const [payments, tasks] = await Promise.all([
      paymentCollection.find({}).sort({ createdAt: -1 }).toArray(),
      tasksCollection.find({}).toArray(),
    ]);

    const taskMap = new Map();
    tasks.forEach((t) => taskMap.set(String(t._id), t));

    const formattedPayments = payments.map((p) => {
      const task = taskMap.get(String(p.taskId)) || null;
      let freelancerEmail = "N/A";
      if (task && Array.isArray(task.proposals)) {
        const acceptedProp = task.proposals.find(
          (prop) =>
            String(prop.status).toLowerCase() === "accepted" ||
            (p.proposalId && String(prop.proposalId) === String(p.proposalId))
        );
        if (acceptedProp) {
          freelancerEmail = acceptedProp.freelancerEmail || acceptedProp.email || "N/A";
        }
      }

      const escrowStatus =
        p.escrowStatus ||
        (task?.status?.toLowerCase() === "completed"
          ? "Released"
          : task?.status?.toLowerCase() === "cancelled"
          ? "Refunded"
          : "Held");

      return {
        _id: String(p._id),
        sessionId: p.sessionId,
        taskId: String(p.taskId),
        taskTitle: task?.title || "Untitled Task",
        taskCategory: task?.category || "General",
        clientEmail: p.userEmail || task?.client_email || "N/A",
        freelancerEmail,
        amount: Number(task?.budget) || 0,
        escrowStatus,
        createdAt: p.createdAt || task?.createdAt,
        taskStatus: task?.status || "In Progress",
      };
    });

    return NextResponse.json({ success: true, payments: formattedPayments });
  } catch (error) {
    console.error("Error in Next.js GET /api/admin/payments:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/payments - Escrow control (release, refund, freeze, unfreeze)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { paymentId, action, note } = body;

    if (!paymentId || !ObjectId.isValid(paymentId)) {
      return NextResponse.json({ success: false, message: "Valid Payment ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const paymentCollection = db.collection("payment");
    const tasksCollection = db.collection("tasks");

    const payment = await paymentCollection.findOne({ _id: new ObjectId(paymentId) });
    if (!payment) {
      return NextResponse.json({ success: false, message: "Payment record not found" }, { status: 404 });
    }

    let newStatus = "Held";
    let taskStatusUpdate = {};

    if (action === "release") {
      newStatus = "Released";
      taskStatusUpdate = { status: "Completed", escrowStatus: "Released" };
    } else if (action === "refund") {
      newStatus = "Refunded";
      taskStatusUpdate = { status: "Cancelled", escrowStatus: "Refunded" };
    } else if (action === "freeze") {
      newStatus = "Frozen";
      taskStatusUpdate = { escrowStatus: "Frozen" };
    } else if (action === "unfreeze") {
      newStatus = "Held";
      taskStatusUpdate = { escrowStatus: "Held" };
    } else {
      return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }

    await paymentCollection.updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          escrowStatus: newStatus,
          adminNote: note || "",
          updatedAt: new Date(),
        },
      }
    );

    if (payment.taskId && ObjectId.isValid(payment.taskId)) {
      await tasksCollection.updateOne({ _id: new ObjectId(payment.taskId) }, { $set: taskStatusUpdate });
    }

    return NextResponse.json({
      success: true,
      message: `Escrow funds successfully updated to '${newStatus}' by Admin.`,
    });
  } catch (error) {
    console.error("Error in Next.js PATCH /api/admin/payments:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update escrow" },
      { status: 500 }
    );
  }
}
