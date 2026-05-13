'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getBookingRequests() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return await prisma.booking.findMany({
    where: {
      warehouse: { ownerId: session.user.id },
      status: "PENDING",
      bookingType: "PLATFORM"
    },
    include: {
      warehouse: true,
      client: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateBookingStatus(bookingId: string, status: 'APPROVED' | 'REJECTED') {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { warehouse: true }
    });

    if (!booking) throw new Error("Booking not found");

    if (status === 'APPROVED') {
      if (booking.warehouse.availableCapacity < booking.weight) {
        throw new Error("Insufficient warehouse capacity");
      }

      await prisma.$transaction([
        prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'APPROVED' }
        }),
        prisma.warehouse.update({
          where: { id: booking.warehouseId },
          data: {
            availableCapacity: { decrement: booking.weight }
          }
        })
      ]);
    } else {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'REJECTED' }
      });
    }

    revalidatePath('/dashboard/warehouse');
    revalidatePath('/dashboard/warehouse/bookings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createManualBooking(data: {
  warehouseId: string;
  clientName: string;
  commodity: string;
  weight: number;
  startDate: Date;
  endDate: Date;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Unauthorized");

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId }
    });

    if (!warehouse) throw new Error("Warehouse not found");
    if (warehouse.availableCapacity < data.weight) throw new Error("Insufficient capacity");

    await prisma.$transaction([
      prisma.booking.create({
        data: {
          warehouseId: data.warehouseId,
          manualClientName: data.clientName,
          commodityType: data.commodity,
          weight: data.weight,
          startDate: data.startDate,
          endDate: data.endDate,
          status: 'APPROVED',
          bookingType: 'MANUAL'
        }
      }),
      prisma.warehouse.update({
        where: { id: data.warehouseId },
        data: {
          availableCapacity: { decrement: data.weight }
        }
      })
    ]);

    revalidatePath('/dashboard/warehouse');
    revalidatePath('/dashboard/warehouse/bookings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
