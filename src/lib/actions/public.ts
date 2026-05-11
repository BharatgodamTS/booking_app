'use server';

import { prisma } from "@/lib/prisma";

export async function getPublicWarehouses() {
  try {
    return await prisma.warehouse.findMany({
      where: {
        status: 'APPROVED'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error("[GET_PUBLIC_WAREHOUSES_ERROR]", error);
    return [];
  }
}
