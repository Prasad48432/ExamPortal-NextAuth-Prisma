import React from "react";
import db from "@/lib/db/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Exams() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const exams = await db.exam.findMany();
  return (
    <div>
      <h1>Exams</h1>
      <ul>
        {exams.map((exam) => (
          <li key={exam.id}>{exam.title}</li>
        ))}
      </ul>
    </div>
  );
}
