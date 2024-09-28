import Image from "next/image";
import { cn } from "@/lib/utils";
import { type Product } from "types/product";
import Link from "next/link";

interface TproductItemProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  width?: number;
  aspectRatio?: "portrait" | "square";
  height?: number;
}

export function ProductItem({
  product,
  aspectRatio,
  width,
  height,
  className,
  ...props
}: TproductItemProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className={cn("space-y-3", className)} {...props}>
        <div>
          <div>
            <div className="overflow-hidden rounded-md">
              <Image
                priority
                src={product.image[0]!}
                alt={product.id.toString()}
                width={width}
                height={height}
                className={cn(
                  "h-auto w-auto object-cover transition-all hover:scale-105",
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
                )}
              />
            </div>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.description}</p>
        </div>
      </div>
    </Link>
  );
}
