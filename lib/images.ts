// High-quality fallback images from Unsplash
export const IMAGE_FALLBACKS = {
  product: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  productPlaceholder: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  fashion: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&h=600&fit=crop',
  menFashion: 'https://images.unsplash.com/photo-1591047139829-c91a6d3cf06d?w=800&h=600&fit=crop',
  womenFashion: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
  shoes: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop',
  avatar: 'https://i.pravatar.cc/150?img=1',
  hero: 'https://images.unsplash.com/photo-1441986300352-c0beefd43cf0?w=1920&h=1080&fit=crop',
  testimonial: 'https://i.pravatar.cc/150?img=',
};

export function getProductImageUrl(productId: string | number): string {
  // Try to generate a consistent URL for products
  const imageIndex = (Number(productId) % 20) + 1;
  return `https://images.unsplash.com/photo-${1500000 + imageIndex}?w=500&h=500&fit=crop`;
}

export function getCategoryImageUrl(category: string): string {
  const categoryMap: Record<string, string> = {
    men: IMAGE_FALLBACKS.menFashion,
    women: IMAGE_FALLBACKS.womenFashion,
    accessories: IMAGE_FALLBACKS.accessories,
    shoes: IMAGE_FALLBACKS.shoes,
    default: IMAGE_FALLBACKS.fashion,
  };
  return categoryMap[category.toLowerCase()] || categoryMap.default;
}

export function getTestimonialAvatarUrl(index: number): string {
  return `${IMAGE_FALLBACKS.testimonial}${index}`;
}
