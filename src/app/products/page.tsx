import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { type Product } from "types/product";

export default async function Page() {
  const allProducts = await api.product.getAll();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {allProducts.map((product) => {
          return <ProductCard product={product} key={product.id}></ProductCard>;
        })}
      </div>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          priority={true}
          style={{ objectFit: "contain" }}
          src={product.image!}
          alt=""
          width={500}
          height={500}
        ></Image>
        <p>{product.description}</p>
      </CardContent>
      <CardFooter>
        <Button>
          <Link href={`/products/${product.id}`}>Book now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
