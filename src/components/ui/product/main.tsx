import { type Metadata } from "next";
import { Sidebar } from "./components/sidebar";
import { playlists } from "./data/playlists";
import { Separator } from "../separator";
import { ScrollArea, ScrollBar } from "../scroll-area";
import { api } from "@/trpc/server";
import { ProductItem } from "./components/album-artwork";
import { type TsearchParams } from "types/product";
import _ from "lodash";

export const metadata: Metadata = {
  title: "Music App",
  description: "Example music app using the components.",
};

export async function ProductPage({
  searchParams,
}: {
  searchParams: TsearchParams;
}) {
  const allProducts = await api.product.getAll({
    address: searchParams.address,
  });
  if (_.isEmpty(allProducts)) {
    return <div>No products found</div>;
  }

  return (
    <div className="block h-full">
      <div className="h-full border-t">
        <div className="grid h-full lg:grid-cols-5">
          <Sidebar playlists={playlists} className="hidden h-full lg:block" />
          <div className="col-span-3 lg:col-span-4 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Book now
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Top picks for you. Updated daily.
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="relative">
                <div className="flex flex-wrap gap-5 pb-4">
                  {allProducts.map((product) => (
                    <ProductItem
                      key={product.id.toString()}
                      product={product}
                      className="w-[250px]"
                      aspectRatio="portrait"
                      width={400}
                      height={400}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Recommended for You
                </h2>
                <p className="text-sm text-muted-foreground">Just for you .</p>
              </div>
              <Separator className="my-4" />
              <div className="relative">
                <ScrollArea>
                  <div className="flex space-x-4 pb-4">
                    {allProducts.map((product) => (
                      <ProductItem
                        key={product.id.toString()}
                        product={product}
                        className="w-[150px]"
                        aspectRatio="square"
                        width={150}
                        height={150}
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
