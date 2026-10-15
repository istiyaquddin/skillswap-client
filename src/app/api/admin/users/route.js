import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/admin/users
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection("user");

    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedUsers = users.map((u) => ({
      _id: String(u._id),
      name: u.name || "Anonymous",
      email: u.email,
      role: u.role || "client",
      status: u.status || "Active",
      image: u.image || "",
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ success: true, users: formattedUsers });
  } catch (error) {
    console.error("Error in Next.js GET /api/admin/users:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users - Toggle or update user status (Active / Blocked)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { userId, status } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    if (!status || (status !== "Active" && status !== "Blocked")) {
      return NextResponse.json({ success: false, message: "Status must be 'Active' or 'Blocked'" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("user");

    const filter = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { _id: userId };
    const result = await usersCollection.updateOne(filter, {
      $set: { status: status, updatedAt: new Date() },
    });

    if (result.matchedCount === 0) {
      // Try string ID match
      const fallbackResult = await usersCollection.updateOne(
        { id: userId },
        { $set: { status: status, updatedAt: new Date() } }
      );
      if (fallbackResult.matchedCount === 0) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, message: `User status updated to ${status}` });
  } catch (error) {
    console.error("Error in Next.js PATCH /api/admin/users:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update user status" },
      { status: 500 }
    );
  }
}
