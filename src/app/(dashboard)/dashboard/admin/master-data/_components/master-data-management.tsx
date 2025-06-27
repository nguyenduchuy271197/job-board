"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndustriesTab } from "./industries-tab";
import { LocationsTab } from "./locations-tab";

export function MasterDataManagement() {
  return (
    <Tabs defaultValue="industries" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="industries">Ngành nghề</TabsTrigger>
        <TabsTrigger value="locations">Địa điểm</TabsTrigger>
      </TabsList>

      <TabsContent value="industries" className="space-y-6">
        <IndustriesTab />
      </TabsContent>

      <TabsContent value="locations" className="space-y-6">
        <LocationsTab />
      </TabsContent>
    </Tabs>
  );
}
