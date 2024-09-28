import { cn } from "@/lib/utils";

import { type Playlist } from "../data/playlists";
import { Button } from "../../button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[];
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Category
          </h2>
          <div className="space-y-1">
            {["Categore 1", "Category 2", "Category 3"].map((item, index) => {
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-green-500"
                >
                  {item}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            City
          </h2>
          <div className="space-y-1">
            {new Array(10).fill(null).map((item, index) => {
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-green-500"
                >
                  {`City-${index}`}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
