export const STORE_CATEGORIES = [
    {
      label: "Women",
      slug: "women",
    },
    {
      label: "Men",
      slug: "men",
    },
    {
      label: "Beauty",
      slug: "beauty",
    },
    {
      label: "Hair Care",
      slug: "hair-care",
    },
    {
      label: "Shoes",
      slug: "shoes",
    },
    {
      label: "Bags",
      slug: "bags",
    },
    {
      label: "Food & Grocery",
      slug: "food-grocery",
    },
    {
      label: "Home Essentials",
      slug: "home-essentials",
    },
    {
      label: "Wigs",
      slug: "wigs",
    },
    {
      label: "Personal Care",
      slug: "personal-care",
    },
    {label: "Kitchen",
        slug: "kitchen",
    },
    {label: "Cleaning",
        slug: "cleaning",
    },
  ] as const;
  
  export function getCategoryLabel(slug?: string | null) {
    const category = STORE_CATEGORIES.find(
      (item) => item.slug === slug
    );
  
    return category?.label || "Uncategorized";
  }