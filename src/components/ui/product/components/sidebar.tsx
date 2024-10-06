import { cn } from "@/lib/utils";

import { type Playlist } from "../data/playlists";
import { Button } from "../../button";
import { api } from "@/trpc/server";
import _ from "lodash";
import { SidebarButton } from "./sidebarButton";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[];
}

export async function Sidebar({ className }: SidebarProps) {
  const allCities = await api.product.getAllCities();
  if (_.isEmpty(allCities)) {
    return <div>No Cities Available</div>;
  }
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Category
          </h2>
          <div className="space-y-1">
            {["Heavy", "Medium", "Light"].map((item, index) => {
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
            {allCities.map((item, index) => {
              return <SidebarButton key={index} text={item}></SidebarButton>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
