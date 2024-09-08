import { Gallery } from "@/app/_components/gallery";
import { ProductDescription } from "@/app/_components/productDescription";
import { api } from "@/trpc/server";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const product = await api.product.getById({ id: parseInt(params.id) });
  if (product) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={[
                  "https://utfs.io/f/8768fbfc-8df8-456a-9563-cbdffe3d4602-jlo1ag.jpeg",
                  "https://utfs.io/f/445a6869-07aa-428a-8351-4b6774ae3391-32wbgv.jpg",
                ].map((m) => {
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
  return <div>asd</div>;
}
