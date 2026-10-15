import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/admin/tasks
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const tasksCollection = db.collection("tasks");

    const rawTasks = await tasksCollection.find({}).sort({ createdAt: -1 }).toArray();

    const formattedTasks = rawTasks.map((task) => {
      let cleanCategory = task.category ? String(task.category).trim() : "Other";
      const lowerCat = cleanCategory.toLowerCase();

      if (lowerCat.includes("dev") || lowerCat.includes("web") || lowerCat.includes("soft")) {
        cleanCategory = "Development";
      } else if (lowerCat.includes("design") || lowerCat.includes("ui") || lowerCat.includes("ux")) {
        cleanCategory = "Design";
      } else if (lowerCat.includes("writ") || lowerCat.includes("content")) {
        cleanCategory = "Writing";
      } else if (lowerCat.includes("market") || lowerCat.includes("seo") || lowerCat.includes("ads")) {
        cleanCategory = "Marketing";
      } else {
        cleanCategory = "Other";
      }

      const rawStatus = task.status ? String(task.status).trim() : "open";
      const isPending = rawStatus.toLowerCase() === "pending" || rawStatus.toLowerCase() === "pending approval";

      return {
        _id: String(task._id),
        title: task.title || "Untitled Task",
        category: cleanCategory,
        budget: Number(task.budget) || 0,
        status: rawStatus,
        approvalStatus: task.approvalStatus || (isPending ? "pending" : "approved"),
        escrowStatus: task.escrowStatus || "unfunded",
        proposals: Array.isArray(task.proposals) ? task.proposals : [],
        createdAt: task.createdAt,
        clientEmail: task.client_email || task.clientEmail || "no-email@domain.com",
        description: task.description || "",
        deadline: task.deadline || "",
      };
    });

    return NextResponse.json({ success: true, tasks: formattedTasks });
  } catch (error) {
    console.error("Error in Next.js GET /api/admin/tasks:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch tasks from database" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/tasks - Moderation actions (approve, reject, award, revoke, etc.)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { taskId, action, proposalId, reason, status } = body;

    if (!taskId || !ObjectId.isValid(taskId)) {
      return NextResponse.json({ success: false, message: "Valid Task ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const tasksCollection = db.collection("tasks");

    const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });
    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    }

    if (action === "approve") {
      await tasksCollection.updateOne(
        { _id: new ObjectId(taskId) },
        {
          $set: {
            status: "open",
            approvalStatus: "approved",
            adminApprovedAt: new Date(),
            rejectionReason: null,
          },
        }
      );
      return NextResponse.json({ success: true, message: "Task approved and published live!" });
    }

    if (action === "reject") {
      await tasksCollection.updateOne(
        { _id: new ObjectId(taskId) },
        {
          $set: {
            status: "rejected",
            approvalStatus: "rejected",
            rejectionReason: reason || "Declined by Admin",
            adminRejectedAt: new Date(),
          },
        }
      );
      return NextResponse.json({ success: true, message: "Task rejected." });
    }

    if (action === "award" && proposalId) {
      const pId = ObjectId.isValid(proposalId) ? new ObjectId(proposalId) : proposalId;
      await tasksCollection.updateOne(
        { _id: new ObjectId(taskId) },
        {
          $set: {
            status: "Accepted",
            "proposals.$[target].status": "Accepted",
            "proposals.$[other].status": "Rejected",
            assignedAt: new Date(),
            assignedBy: "admin",
          },
        },
        {
          arrayFilters: [
            { "target.proposalId": pId },
            { "other.proposalId": { $ne: pId }, "other.status": { $ne: "Accepted" } },
          ],
        }
      );
      return NextResponse.json({ success: true, message: "Job awarded to candidate by Admin" });
    }

    if (action === "reject_proposal" && proposalId) {
      const pId = ObjectId.isValid(proposalId) ? new ObjectId(proposalId) : proposalId;
      await tasksCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { "proposals.$[target].status": "Rejected" } },
        { arrayFilters: [{ "target.proposalId": pId }] }
      );
      return NextResponse.json({ success: true, message: "Proposal rejected by Admin" });
    }

    if (action === "revoke" && proposalId) {
      const pId = ObjectId.isValid(proposalId) ? new ObjectId(proposalId) : proposalId;
      await tasksCollection.updateOne(
        { _id: new ObjectId(taskId) },
        {
          $set: {
            status: "open",
            "proposals.$[target].status": "Pending",
          },
        },
        { arrayFilters: [{ "target.proposalId": pId }] }
      );
      return NextResponse.json({ success: true, message: "Job award revoked. Task reopened." });
    }

    if (status) {
      await tasksCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { status: status, updatedAt: new Date() } }
      );
      return NextResponse.json({ success: true, message: `Task status updated to ${status}` });
    }

    return NextResponse.json({ success: false, message: "Invalid action or parameters" }, { status: 400 });
  } catch (error) {
    console.error("Error in Next.js PATCH /api/admin/tasks:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tasks
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");

    if (!taskId || !ObjectId.isValid(taskId)) {
      return NextResponse.json({ success: false, message: "Valid Task ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const tasksCollection = db.collection("tasks");

    const result = await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in Next.js DELETE /api/admin/tasks:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete task" },
      { status: 500 }
    );
  }
}
