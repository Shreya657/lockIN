"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "../../../utils/prisma";

export async function logProof(formData: {
  title: string;
  category: string;
  proofUrl?: string;
  description?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) 
    throw new Error("Unauthorized");

  const userId = session.user.id;


  await prisma.proof.create({
    data: {
      title: formData.title,
      category: formData.category.toUpperCase(), // Normalize categories
      proofUrl: formData.proofUrl || "",
      description: formData.description || "",
      userId: userId,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      lastActive: new Date().toISOString(),
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteProof(proofId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) 
    throw new Error("Unauthorized");

  await prisma.proof.delete({
    where: {
      id: proofId,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateProof(id: string, formData: {
  title: string;
  category: string;
  proofUrl?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.proof.update({
    where: { id, userId: session.user.id },
    data: {
      title: formData.title,
      category: formData.category.toUpperCase(),
      proofUrl: formData.proofUrl || "",
    },
  });

  revalidatePath("/dashboard");
}