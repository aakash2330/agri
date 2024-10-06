import { ProductPage } from "@/components/ui/product/main";
import { type TsearchParams } from "types/product";

export default async function Page({
  searchParams,
}: {
  searchParams: TsearchParams;
}) {
  return <ProductPage searchParams={searchParams}></ProductPage>;
}
