'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getClientDashboardStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { totalWeight: 0, activeBookings: 0, pendingRequests: 0 };

  const bookings = await prisma.booking.findMany({
    where: { clientId: session.user.id }
  });

  const activeBookings = bookings.filter(b => b.status === 'APPROVED').length;
  const pendingRequests = bookings.filter(b => b.status === 'PENDING').length;
  const totalWeight = bookings
    .filter(b => b.status === 'APPROVED')
    .reduce((sum, b) => sum + (b.weight || 0), 0);

  return { totalWeight, activeBookings, pendingRequests };
}

export async function searchWarehouses(query: string = "") {
  return await prisma.warehouse.findMany({
    where: {
      status: 'APPROVED',
      OR: [
        { name: { contains: query } },
        { address: { contains: query } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function submitClientRequest(data: {
  warehouseId: string;
  commodityType: string;
  weight: number;
  startDate: Date;
  endDate: Date;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.booking.create({
      data: {
        warehouseId: data.warehouseId,
        clientId: session.user.id,
        commodityType: data.commodityType,
        weight: data.weight,
        startDate: data.startDate,
        endDate: data.endDate,
        status: 'PENDING',
        bookingType: 'PLATFORM'
      }
    });

    revalidatePath('/dashboard/client');
    revalidatePath('/dashboard/client/history');
    revalidatePath('/dashboard/warehouse/bookings'); // Notify owner

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getClientBookingHistory() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return await prisma.booking.findMany({
    where: { clientId: session.user.id },
    include: { warehouse: true },
    orderBy: { createdAt: 'desc' }
  });
}
