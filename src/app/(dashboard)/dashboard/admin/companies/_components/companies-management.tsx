"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Edit,
  MoreHorizontal,
  Building,
  Calendar,
  Briefcase,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCompanies } from "@/hooks/admin/companies";
import { useApproveCompany } from "@/hooks/admin/companies";
import { Loading } from "@/components/shared/loading";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CompanyDetailsDialog } from "./company-details-dialog";
import { getRelativeTime } from "@/constants/labels";
import { toast } from "sonner";
import type { CompanyDetails } from "@/types/custom.types";

export function CompaniesManagement() {
  const [filters, setFilters] = useState({
    search: "",
    verified: "all" as "all" | "true" | "false",
    industry: "",
    page: 1,
  });

  const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(
    null
  );
  const [companyToApprove, setCompanyToApprove] =
    useState<CompanyDetails | null>(null);
  const [isCompanyDetailsOpen, setIsCompanyDetailsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Fetch companies data
  const { data: companiesData, isLoading } = useCompanies({
    page: filters.page,
    limit: 20,
    search: filters.search || undefined,
    verified:
      filters.verified !== "all" ? filters.verified === "true" : undefined,
    industry: filters.industry || undefined,
  });

  // Approve company mutation
  const approveCompanyMutation = useApproveCompany();

  const companies =
    companiesData?.success && companiesData.data
      ? companiesData.data.companies
      : [];
  const pagination =
    companiesData?.success && companiesData.data ? companiesData.data : null;

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleVerifiedChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      verified: value as typeof filters.verified,
      page: 1,
    }));
  };

  const handleIndustryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      industry: value,
      page: 1,
    }));
  };

  const handleCompanyDetails = (company: CompanyDetails) => {
    setSelectedCompany(company);
    setIsCompanyDetailsOpen(true);
  };

  const handleApproveClick = (company: CompanyDetails) => {
    setCompanyToApprove(company);
    setIsConfirmDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!companyToApprove) return;

    try {
      const result = await approveCompanyMutation.mutateAsync({
        company_id: companyToApprove.id,
      });

      if (result.success) {
        toast.success("Đã phê duyệt công ty thành công");
        setIsConfirmDialogOpen(false);
        setCompanyToApprove(null);
      } else {
        toast.error(result.error || "Phê duyệt công ty thất bại");
      }
    } catch (error) {
      toast.error("Phê duyệt công ty thất bại");
      console.error("Approve company error:", error);
    }
  };

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Check className="h-3 w-3" />
        Đã duyệt
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1">
        <X className="h-3 w-3" />
        Chờ duyệt
      </Badge>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên công ty..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.verified}
              onValueChange={handleVerifiedChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái xác minh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">Đã xác minh</SelectItem>
                <SelectItem value="false">Chờ xác minh</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.industry}
              onValueChange={handleIndustryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ngành nghề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả ngành nghề</SelectItem>
                <SelectItem value="technology">Công nghệ</SelectItem>
                <SelectItem value="finance">Tài chính</SelectItem>
                <SelectItem value="healthcare">Y tế</SelectItem>
                <SelectItem value="education">Giáo dục</SelectItem>
                <SelectItem value="manufacturing">Sản xuất</SelectItem>
                <SelectItem value="retail">Bán lẻ</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {pagination?.total || 0} công ty
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Công ty</TableHead>
                <TableHead>Ngành nghề</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Việc làm</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Building className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Không tìm thấy công ty nào
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={company.logo_url || undefined} />
                          <AvatarFallback>
                            {company.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {company.email || "Chưa có email"}
                          </div>
                          {company.location && (
                            <div className="text-xs text-muted-foreground">
                              {company.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.industry ? (
                        <Badge variant="outline" className="capitalize">
                          {company.industry}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Chưa cập nhật
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getVerificationBadge(company.verified)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {company.jobs_count || 0} việc làm
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {getRelativeTime(company.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleCompanyDetails(company)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {!company.verified && (
                            <DropdownMenuItem
                              onClick={() => handleApproveClick(company)}
                              className="text-green-600"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Phê duyệt
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            trong số {pagination.total} công ty
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={!pagination.has_previous}
            >
              Trang trước
            </Button>
            <span className="text-sm">Trang {pagination.page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={!pagination.has_next}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {selectedCompany && (
        <CompanyDetailsDialog
          company={selectedCompany}
          open={isCompanyDetailsOpen}
          onOpenChange={setIsCompanyDetailsOpen}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        title="Xác nhận phê duyệt công ty"
        description={`Bạn có chắc chắn muốn phê duyệt công ty "${companyToApprove?.name}"? Công ty sẽ được xác minh và có thể đăng tin tuyển dụng.`}
        confirmText="Phê duyệt"
        variant="default"
        onConfirm={handleApproveConfirm}
        isLoading={approveCompanyMutation.isPending}
      />
    </div>
  );
}
