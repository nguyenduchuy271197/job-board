import { notFound } from "next/navigation";
import { JobDetails } from "./_components/job-details";
import { RelatedJobs } from "./_components/related-jobs";
import { getJobBySlug } from "@/actions/jobs";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const result = await getJobBySlug(slug);

    if (!result.success || !result.data) {
      return {
        title: "Không tìm thấy công việc | Jobboard",
        description: "Công việc này không tồn tại hoặc đã bị xóa.",
      };
    }

    const job = result.data;

    return {
      title: `${job.title} tại ${job.companies?.name} | Jobboard`,
      description: `${job.description?.slice(0, 150)}...`,
      keywords: [
        job.title,
        job.companies?.name || "",
        job.location || "",
        "việc làm",
        "tuyển dụng",
        ...(job.job_skills?.map((skill) => skill.skills.name) || []),
      ].filter(Boolean),
      openGraph: {
        title: `${job.title} tại ${job.companies?.name} | Jobboard`,
        description: `${job.description?.slice(0, 150)}...`,
        type: "article",
        images: job.companies?.logo_url
          ? [{ url: job.companies.logo_url }]
          : undefined,
      },
    };
  } catch {
    return {
      title: "Chi tiết công việc | Jobboard",
      description: "Xem thông tin chi tiết về cơ hội việc làm này.",
    };
  }
}

interface JobPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <JobDetails jobSlug={slug} />
      <RelatedJobs jobSlug={slug} />
    </div>
  );
}
