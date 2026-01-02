import {
  pgTable,
  text,
  integer,
  real,
  timestamp,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

export const dailySalesReports = pgTable(
  "daily_sales_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    outletId: text("outlet_id").notNull(),
    date: timestamp("date", { mode: "date" }).notNull(),

    // Totals
    totalSales: real("total_sales").notNull(),
    totalOrders: integer("total_orders").notNull(),
    totalCovers: integer("total_covers").notNull(),
    averageCheck: real("average_check").notNull(),

    // By payment
    cashSales: real("cash_sales").default(0).notNull(),
    cardSales: real("card_sales").default(0).notNull(),
    otherSales: real("other_sales").default(0).notNull(),

    // Breakdowns
    foodSales: real("food_sales").default(0).notNull(),
    beverageSales: real("beverage_sales").default(0).notNull(),
    alcoholSales: real("alcohol_sales").default(0).notNull(),

    // Other
    taxCollected: real("tax_collected").default(0).notNull(),
    discountsGiven: real("discounts_given").default(0).notNull(),
    tipsCollected: real("tips_collected").default(0).notNull(),

    // Costs
    laborCost: real("labor_cost").default(0).notNull(),
    foodCost: real("food_cost").default(0).notNull(),

    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    unq: unique().on(table.outletId, table.date),
  }),
);
