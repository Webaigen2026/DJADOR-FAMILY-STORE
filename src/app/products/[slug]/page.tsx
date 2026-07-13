import ProductInfo from "../../../components/products/product-info";
import AddToCartButton from "../../../components/products/add-to-cart-button";
import ProductGallery from "../../../components/products/product-gallery";
import { prisma } from "../../../lib/prisma";

type ProductImage = {
  id: string;
  url: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string | null;
  brand?: string | null;
  category?: string | null;
  stock: number;
  imageUrl?: string | null;
  image?: string | null;
  images?: ProductImage[];
};

async function getProduct(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
    },
  });

  return product;
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-3xl font-bold text-slate-900">
          Product Not Found
        </h1>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : [product.imageUrl || product.image || "/images/headphones.jpg"];

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <ProductGallery
            images={galleryImages}
            name={product.name}
          />

          <div>
            <ProductInfo
              name={product.name}
              price={product.price}
              description={product.description || undefined}
              brand={product.brand || undefined}
              category={product.category || undefined}
              stock={product.stock}
            />

            <div className="mt-8 border-t border-slate-200 pt-6">
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}