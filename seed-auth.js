import dns from "dns";
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

import { MongoClient, ObjectId } from "mongodb";
import { auth } from "./src/lib/auth.js";

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.AUTH_DB_NAME || "freelance_auth_db";
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  const usersCol = db.collection("user");
  const accountCol = db.collection("account");

  const demoUsers = [
    {
      email: "admin@demo.com",
      password: "DemoAdmin123",
      name: "Alex Sterling",
      role: "admin",
      title: "Chief Systems Administrator",
      bio: "Head of Platform Moderation and System Operations at SkillSwap.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      status: "Active",
    },
    {
      email: "client@demo.com",
      password: "DemoClient123",
      name: "Sarah Jenkins",
      role: "client",
      company: "TechPulse Innovations",
      bio: "VP of Product at TechPulse Innovations. SaaS web apps & enterprise solutions.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      status: "Active",
    },
    {
      email: "freelancer@demo.com",
      password: "DemoFreelancer123",
      name: "David Chen",
      role: "freelancer",
      title: "Senior Full-Stack & Next.js Specialist",
      bio: "Full-stack engineer with 7+ years experience in React, Next.js, and Node.js.",
      hourlyRate: 65,
      skills: "React,Next.js,Node.js,Tailwind CSS,TypeScript,MongoDB,UI/UX Design",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      status: "Active",
    },
  ];

  for (const u of demoUsers) {
    const existing = await usersCol.findOne({ email: u.email });
    if (existing) {
      console.log(`Removing existing ${u.email} to recreate clean better-auth credentials...`);
      await usersCol.deleteOne({ email: u.email });
      await accountCol.deleteMany({ userId: existing._id.toString() });
      await accountCol.deleteMany({ userId: existing._id });
    }

    console.log(`Signing up ${u.email}...`);
    try {
      const res = await auth.api.signUpEmail({
        body: {
          email: u.email,
          password: u.password,
          name: u.name,
        },
      });
      console.log(`Successfully created better-auth user for ${u.email}:`, res?.user?.id);

      // Now enrich user document with custom role, image, bio, title, etc.
      await usersCol.updateOne(
        { email: u.email },
        {
          $set: {
            role: u.role,
            title: u.title || "",
            bio: u.bio || "",
            company: u.company || "",
            image: u.image || "",
            status: u.status || "Active",
            hourlyRate: u.hourlyRate || 0,
            skills: u.skills || "",
          },
        }
      );
      console.log(`Enriched ${u.email} profile in database.`);
    } catch (err) {
      console.error(`Error creating ${u.email}:`, err);
    }
  }

  await client.close();
  console.log("Better-auth demo users setup complete!");
  process.exit(0);
}

main();
