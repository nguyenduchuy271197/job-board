"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import { useCompany } from "@/hooks/companies";
import { Loading } from "@/components/shared/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CompanyForm } from "./company-form";
import { CompanyProfile } from "./company-profile";

import { createClient } from "@/lib/supabase/client";

export function CompanyManagement() {
  const [currentUserCompany, setCurrentUserCompany] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Get current user's company
  useEffect(() => {
    async function getUserCompany() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: companyMember } = await supabase
          .from("company_members")
          .select("company_id")
          .eq("user_id", user.id)
          .single();

        if (companyMember) {
          setCurrentUserCompany(companyMember.company_id);
        }
      } catch (error) {
        console.error("Error getting user company:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getUserCompany();
  }, []);

  const {
    data: companyData,
    isLoading: isLoadingCompany,
    error,
  } = useCompany({ id: currentUserCompany || "" });

  if (isLoading) {
    return <Loading />;
  }

  // User doesn't have a company yet
  if (!currentUserCompany) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Chưa có thông tin công ty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Bạn chưa có thông tin công ty
              </h3>
              <p className="text-muted-foreground mb-6">
                Tạo hồ sơ công ty để bắt đầu đăng tin tuyển dụng và quản lý ứng
                viên.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo thông tin công ty
              </Button>
            </div>
          </CardContent>
        </Card>

        {showCreateForm && (
          <CompanyForm
            onCancel={() => setShowCreateForm(false)}
            onSuccess={(company) => {
              setShowCreateForm(false);
              setCurrentUserCompany(company.id);
            }}
          />
        )}
      </div>
    );
  }

  if (isLoadingCompany) {
    return <Loading />;
  }

  if (error || !companyData?.success) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Có lỗi xảy ra khi tải thông tin công ty. Vui lòng thử lại sau.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {companyData.data && <CompanyProfile company={companyData.data} />}
    </div>
  );
}
