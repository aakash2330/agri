import { Gallery } from "@/app/_components/gallery";
import { ProductDescription } from "@/app/_components/productDescription";
import { api } from "@/trpc/server";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const product = await api.product.getById({ id: params.id });
  if (product) {
    return (
      <div className="h-full w-full px-4">
        <div className="bg-red-200full flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
          <div className="flex h-full w-full basis-full flex-col items-center justify-center lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.image.map((m) => {
                  return { src: m, altText: m };
                })}
              />
            </Suspense>
          </div>
          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }
  return <div>No product found</div>;
}
