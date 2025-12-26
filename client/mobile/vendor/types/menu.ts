export interface Category {
  id: string;
  name: string;
  icon?: string;
  productCount?: number;
}

export interface MenuItem {
  id: string;
  vendorId: string;
  categoryId: string;
  category?: Category;
  name: string;
  description?: string;
  images: string[];
  price: number;
  discountPrice?: number;
  inStock: boolean;
  stockQuantity?: number;
  isVeg: boolean;
  isVegan?: boolean;
  calories?: number;
  allergens?: string[];
  packSize?: string;
  brand?: string;
  dietType?: string;
  prepTime?: number;
  customizations?: MenuCustomization[];
  rating?: number;
  totalRatings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuCustomization {
  id: string;
  name: string;
  required: boolean;
  maxSelections?: number;
  options: MenuCustomizationOption[];
}

export interface MenuCustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuResponse {
  items: MenuItem[];
  categories: Category[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateMenuItemRequest {
  categoryId: string;
  name: string;
  description?: string;
  images?: string[];
  price: number;
  discountPrice?: number;
  inStock?: boolean;
  stockQuantity?: number;
  isVeg: boolean;
  isVegan?: boolean;
  calories?: number;
  allergens?: string[];
  prepTime?: number;
  customizations?: MenuCustomization[];
}

export interface UpdateMenuItemRequest extends Partial<CreateMenuItemRequest> {
  id: string;
}
