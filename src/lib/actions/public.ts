'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

export async function registerUser(formData: any) {
  try {
    const { 
      email, 
      password, 
      name, 
      role, 
      phone, 
      location,
      companyName,
      warehouseCount,
      city,
      businessType,
      gstNumber,
      requirements
    } = formData;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists." };
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create user in PENDING state
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        phone,
        location,
        approvalStatus: "PENDING",
        // Conditional metadata
        companyName: role === "OWNER" ? companyName : null,
        warehouseCount: role === "OWNER" ? parseInt(warehouseCount) || 0 : null,
        city: role === "CLIENT" ? city : null,
        businessType: role === "CLIENT" ? businessType : null,
        gstNumber: role === "CLIENT" ? gstNumber : null,
        requirements: role === "CLIENT" ? requirements : null,
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("[REGISTER_USER_ERROR]", error);
    return { success: false, error: error.message || "Registration failed. Please try again." };
  }
}
