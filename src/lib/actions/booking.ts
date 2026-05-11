'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getOwnerBookings() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    return await prisma.booking.findMany({
      where: {
        warehouse: {
          ownerId: session.user.id
        }
      },
      include: {
        warehouse: true,
        client: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error("[GET_BOOKINGS_ERROR]", error);
    return [];
  }
}

export async function updateBookingStatus(bookingId: string, status: 'APPROVED' | 'REJECTED') {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { warehouse: true }
    });

    if (!booking) return { success: false, error: "Booking not found" };

    if (status === 'APPROVED') {
      if (booking.weight > booking.warehouse.availableCapacity) {
        return { success: false, error: `Insufficient space. Only ${booking.warehouse.availableCapacity} MT available.` };
      }

      await prisma.$transaction([
        prisma.warehouse.update({
          where: { id: booking.warehouseId },
          data: { availableCapacity: { decrement: booking.weight } }
        }),
        prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'APPROVED' }
        })
      ]);
    } else {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'REJECTED' }
      });
    }

    revalidatePath('/dashboard/warehouse/bookings');
    revalidatePath('/dashboard/warehouse/warehouses');
    revalidatePath('/dashboard/warehouse');
    
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_BOOKING_ERROR]", error);
    return { success: false, error: "Failed to update booking status" };
  }
}

export async function createManualBooking(data: {
  warehouseId: string;
  clientName: string;
  clientContact: string;
  weight: number;
  commodityType: string;
  startDate: string;
  endDate: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: data.warehouseId }
    });

    if (!warehouse) return { success: false, error: "Warehouse not found" };

    if (data.weight > warehouse.availableCapacity) {
      return { success: false, error: `Insufficient space. Only ${warehouse.availableCapacity} MT left.` };
    }

    await prisma.$transaction([
      prisma.warehouse.update({
        where: { id: data.warehouseId },
        data: { availableCapacity: { decrement: data.weight } }
      }),
      prisma.booking.create({
        data: {
          warehouseId: data.warehouseId,
          manualClientName: data.clientName,
          manualClientContact: data.clientContact,
          weight: data.weight,
          commodityType: data.commodityType,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          status: 'APPROVED',
          bookingType: 'MANUAL'
        }
      })
    ]);

    revalidatePath('/dashboard/warehouse/bookings');
    revalidatePath('/dashboard/warehouse/warehouses');
    revalidatePath('/dashboard/warehouse/reports');
    revalidatePath('/dashboard/warehouse');

    return { success: true };
  } catch (error) {
    console.error("[CREATE_MANUAL_BOOKING_ERROR]", error);
    return { success: false, error: "Failed to register manual booking" };
  }
}
