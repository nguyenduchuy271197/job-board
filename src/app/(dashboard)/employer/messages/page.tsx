import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Loading } from "@/components/shared/loading";
import { MessagesManagement } from "./_components/messages-management";
import { PAGE_TITLES } from "@/constants/labels";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin nhắn | Jobboard",
  description:
    "Quản lý tin nhắn và liên lạc với ứng viên. Trao đổi thông tin tuyển dụng một cách nhanh chóng và hiệu quả.",
  keywords: [
    "tin nhắn",
    "messages",
    "liên lạc",
    "ứng viên",
    "nhà tuyển dụng",
    "trao đổi",
  ],
  openGraph: {
    title: "Tin nhắn | Jobboard",
    description:
      "Quản lý tin nhắn và liên lạc với ứng viên. Trao đổi thông tin tuyển dụng một cách nhanh chóng và hiệu quả.",
    type: "website",
  },
};

export default function EmployerMessagesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={PAGE_TITLES.messages || "Tin nhắn"}
        description="Quản lý tin nhắn và liên lạc với ứng viên"
      />

      <Suspense fallback={<Loading />}>
        <MessagesManagement />
      </Suspense>
    </div>
  );
}
