import { getServerUser } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileView } from "./_components/profile-view";
import { ProfileEditDialog } from "./_components/profile-edit-dialog";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân | Jobboard",
  description:
    "Quản lý thông tin cá nhân và hồ sơ nghề nghiệp của bạn. Cập nhật thông tin để tăng cơ hội được tuyển dụng.",
  keywords: [
    "hồ sơ",
    "profile",
    "thông tin cá nhân",
    "nghề nghiệp",
    "cập nhật",
  ],
  openGraph: {
    title: "Hồ sơ cá nhân | Jobboard",
    description:
      "Quản lý thông tin cá nhân và hồ sơ nghề nghiệp của bạn. Cập nhật thông tin để tăng cơ hội được tuyển dụng.",
    type: "profile",
  },
};

export default async function ProfilePage() {
  const user = await getServerUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Quản lý thông tin cá nhân và hồ sơ nghề nghiệp"
        action={<ProfileEditDialog user={user} />}
      />

      <ProfileView user={user} />
    </div>
  );
}
