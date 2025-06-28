import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileTabs } from "./_components/profile-tabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân | JobBoard",
  description: "Quản lý thông tin hồ sơ cá nhân của bạn trên JobBoard.",
};

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Quản lý thông tin cá nhân và cài đặt tài khoản của bạn"
      />

      <ProfileTabs user={user} />
    </div>
  );
}
