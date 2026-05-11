'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') return [];

  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
}

export async function createNewUser(data: {
  name: string;
  email: string;
  password: string;
  role: 'OWNER' | 'CLIENT' | 'ADMIN';
}) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role
      }
    });

    revalidatePath('/admin/users');
    return { success: true, user };
  } catch (error: any) {
    console.error("[CREATE_USER_ERROR]", error);
    if (error.code === 'P2002') {
      return { success: false, error: "Email already exists" };
    }
    return { success: false, error: "Failed to create user" };
  }
}

export async function getPendingWarehouses() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') return [];

  return await prisma.warehouse.findMany({
    where: { status: 'PENDING' },
    include: { owner: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function verifyWarehouse(warehouseId: string, action: 'APPROVED' | 'REJECTED', reason?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.warehouse.update({
      where: { id: warehouseId },
      data: { 
        status: action,
        rejectionReason: action === 'REJECTED' ? reason : null
      }
    });

    revalidatePath('/admin/warehouses');
    revalidatePath('/dashboard/warehouse/warehouses');
    return { success: true };
  } catch (error) {
    console.error("[VERIFY_WAREHOUSE_ERROR]", error);
    return { success: false, error: "Failed to verify warehouse" };
  }
}
