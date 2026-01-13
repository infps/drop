import { Hono } from "hono";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  getPaginationParams,
  notFoundResponse,
} from "../../middleware/response";
import prisma from "../../lib/prisma";

const app = new Hono();

// GET / - List all vendors (public)
app.get("/", async (c) => {
  try {
    const { page, limit, skip } = getPaginationParams(c);
    const search = c.req.query("search");
    const category = c.req.query("category");

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.type = category;
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ rating: "desc" }, { totalRatings: "desc" }],
        select: {
          id: true,
          name: true,
          logo: true,
          coverImage: true,
          description: true,
          type: true,
          address: true,
          latitude: true,
          longitude: true,
          rating: true,
          totalRatings: true,
          minimumOrder: true,
          avgDeliveryTime: true,
          cuisineTypes: true,
          isActive: true,
          openingTime: true,
          closingTime: true,
        },
      }),
      prisma.vendor.count({ where }),
    ]);

    return paginatedResponse(c, vendors, page, limit, total);
  } catch (error) {
    console.error("List vendors error:", error);
    return errorResponse(c, "Failed to fetch vendors", 500);
  }
});

// GET /:id - Get single vendor by ID (public)
app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const vendor = await prisma.vendor.findFirst({
      where: { id, isActive: true },
      select: {
        id: true,
        name: true,
        logo: true,
        coverImage: true,
        description: true,
        type: true,
        address: true,
        latitude: true,
        longitude: true,
        rating: true,
        totalRatings: true,
        minimumOrder: true,
        avgDeliveryTime: true,
        cuisineTypes: true,
        isActive: true,
        openingTime: true,
        closingTime: true,
        phone: true,
      },
    });

    if (!vendor) {
      return notFoundResponse(c, "Vendor not found");
    }

    return successResponse(c, vendor);
  } catch (error) {
    console.error("Get vendor error:", error);
    return errorResponse(c, "Failed to fetch vendor", 500);
  }
});

// GET /:id/products - Get vendor's products (public)
app.get("/:id/products", async (c) => {
  try {
    const vendorId = c.req.param("id");
    const { page, limit, skip } = getPaginationParams(c);
    const category = c.req.query("category");
    const search = c.req.query("search");

    const vendor = await prisma.vendor.findFirst({
      where: { id: vendorId, isActive: true },
    });

    if (!vendor) {
      return notFoundResponse(c, "Vendor not found");
    }

    const where: any = {
      vendorId,
      inStock: true,
    };

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, icon: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return paginatedResponse(c, products, page, limit, total);
  } catch (error) {
    console.error("Get vendor products error:", error);
    return errorResponse(c, "Failed to fetch products", 500);
  }
});

export default app;
