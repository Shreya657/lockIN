"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "../../../utils/prisma";


export async function updateProfile(name: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) 
    throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  revalidatePath("/dashboard/settings");
}

export async function deleteAccount() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await prisma.user.delete({
    where: { id: session.user.id },
  });

   revalidatePath("/");

}