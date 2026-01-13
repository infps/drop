// All enum types from the database schema

export type VendorType =
  | "RESTAURANT"
  | "GROCERY"
  | "WINE_SHOP"
  | "PHARMACY"
  | "MEAT_SHOP"
  | "MILK_DAIRY"
  | "PET_SUPPLIES"
  | "FLOWERS"
  | "GENERAL_STORE";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderType = "DELIVERY" | "PICKUP" | "DINE_IN";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type GenieOrderType =
  | "PICKUP_DROP"
  | "MULTI_STOP"
  | "RETURN_DELIVERY"
  | "BULK_DELIVERY";

export type StopType = "PICKUP" | "DROP" | "WAIT_AND_RETURN";

export type VehicleType =
  | "BICYCLE"
  | "SCOOTER"
  | "BIKE"
  | "EV_BIKE"
  | "EV_SCOOTER"
  | "CAR"
  | "DRONE";

export type PartyStatus =
  | "PLANNING"
  | "ORDERING"
  | "ORDERED"
  | "DELIVERED"
  | "COMPLETED";

export type SplitType = "EQUAL" | "BY_ITEM" | "CUSTOM";

export type PaymentType = "CARD" | "UPI" | "WALLET" | "NET_BANKING" | "COD";

export type TransactionType =
  | "CREDIT"
  | "DEBIT"
  | "CASHBACK"
  | "REFUND"
  | "TOP_UP";

export type SubscriptionPlan = "MONTHLY" | "QUARTERLY" | "YEARLY";

export type LoyaltyTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export type PointsType = "EARNED" | "REDEEMED" | "EXPIRED" | "BONUS";

export type DiscountType = "PERCENTAGE" | "FLAT" | "FREE_DELIVERY";

export type TicketType =
  | "REFUND"
  | "MISSING_ITEM"
  | "WRONG_ITEM"
  | "QUALITY_ISSUE"
  | "DELIVERY_ISSUE"
  | "OTHER";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type NotificationType =
  | "ORDER_UPDATE"
  | "PROMOTION"
  | "SYSTEM"
  | "REMINDER";

export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "OPERATIONS"
  | "FINANCE"
  | "MARKETING"
  | "SUPPORT";

export type TableShape = "RECTANGLE" | "SQUARE" | "CIRCLE" | "OVAL";

export type TableStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "CLEANING"
  | "BLOCKED";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SEATED"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELLED";

export type ReservationSource =
  | "PHONE"
  | "WALK_IN"
  | "WEBSITE"
  | "APP"
  | "OPEN_TABLE"
  | "THIRD_PARTY";

export type WaitlistStatus =
  | "WAITING"
  | "NOTIFIED"
  | "SEATED"
  | "LEFT"
  | "CANCELLED";

export type DineInOrderType = "DINE_IN" | "TAKEAWAY" | "BAR_TAB" | "ROOM_SERVICE";

export type DineInOrderStatus =
  | "OPEN"
  | "PRINTED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CLOSED"
  | "VOID";

export type CourseType =
  | "APPETIZER"
  | "SOUP"
  | "SALAD"
  | "MAIN"
  | "DESSERT"
  | "BEVERAGE"
  | "BAR";

export type OrderItemStatus =
  | "PENDING"
  | "SENT"
  | "ACKNOWLEDGED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "VOID";

export type SplitBillType = "EQUAL" | "BY_SEAT" | "BY_ITEM" | "CUSTOM";

export type DineInPaymentMethod =
  | "CASH"
  | "CARD"
  | "UPI"
  | "WALLET"
  | "GIFT_CARD"
  | "CREDIT"
  | "COMPLIMENTARY";

export type ShiftStatus = "OPEN" | "CLOSED" | "RECONCILED";

export type StationType =
  | "HOT"
  | "COLD"
  | "GRILL"
  | "FRY"
  | "SALAD"
  | "DESSERT"
  | "BAR"
  | "EXPO"
  | "PACKAGING";

export type KDSTicketStatus =
  | "NEW"
  | "ACKNOWLEDGED"
  | "IN_PROGRESS"
  | "READY"
  | "SERVED"
  | "RECALLED";

export type KDSItemStatus = "PENDING" | "COOKING" | "DONE" | "SERVED";

export type StockMovementType =
  | "PURCHASE"
  | "SALE"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "ADJUSTMENT"
  | "WASTE"
  | "RETURN"
  | "COUNT_ADJUSTMENT";

export type POStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "SENT"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED";

export type InvoiceStatus =
  | "PENDING"
  | "APPROVED"
  | "PAID"
  | "DISPUTED"
  | "CANCELLED";

export type StockCountType = "FULL" | "CYCLE" | "SPOT";

export type StockCountStatus =
  | "IN_PROGRESS"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "CANCELLED";

export type TransferStatus =
  | "DRAFT"
  | "REQUESTED"
  | "APPROVED"
  | "IN_TRANSIT"
  | "RECEIVED"
  | "CANCELLED";

export type WasteReason =
  | "EXPIRED"
  | "SPOILED"
  | "OVERPRODUCTION"
  | "CUSTOMER_RETURN"
  | "DROPPED"
  | "BURNT"
  | "QUALITY_ISSUE"
  | "OTHER";

export type EmployeeRole =
  | "OWNER"
  | "MANAGER"
  | "SUPERVISOR"
  | "HOST"
  | "SERVER"
  | "BARTENDER"
  | "CHEF"
  | "LINE_COOK"
  | "CASHIER"
  | "BUSSER"
  | "RUNNER"
  | "DISHWASHER";

export type ScheduleStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "SWAP_REQUESTED"
  | "CANCELLED";

export type TimeEntryStatus = "PENDING" | "APPROVED" | "REJECTED" | "EDITED";

export type TipPoolStatus = "PENDING" | "DISTRIBUTED";

export type RewardType =
  | "DISCOUNT_FIXED"
  | "DISCOUNT_PERCENT"
  | "FREE_ITEM"
  | "UPGRADE";

export type GiftCardTxType =
  | "PURCHASE"
  | "RELOAD"
  | "REDEMPTION"
  | "REFUND"
  | "VOID";

export type CampaignType =
  | "PROMOTIONAL"
  | "BIRTHDAY"
  | "ANNIVERSARY"
  | "WIN_BACK"
  | "FEEDBACK"
  | "ANNOUNCEMENT";

export type CampaignChannel = "EMAIL" | "SMS" | "PUSH" | "WHATSAPP";

export type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "CANCELLED";

export type PrinterType = "RECEIPT" | "KITCHEN" | "BAR" | "LABEL";

export type ConnectionType = "USB" | "NETWORK" | "BLUETOOTH";

export type SensorType = "TEMPERATURE" | "HUMIDITY" | "DOOR" | "EQUIPMENT";
