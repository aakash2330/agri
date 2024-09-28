import { SendBookingQueryForm } from "@/components/sendBookingQueryForm";
import { type Product } from "types/product";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mr-auto w-auto rounded-lg bg-black p-2 text-sm text-white">
          {product.address}
        </div>
      </div>
      <div>{product.description}</div>
      <div className="mt-[5rem]">
        <SendBookingQueryForm productId={product.id}></SendBookingQueryForm>
      </div>
    </>
  );
}
