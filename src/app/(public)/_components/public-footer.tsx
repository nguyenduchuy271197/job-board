import Link from "next/link";
import { Briefcase, Mail, Phone, MapPin } from "lucide-react";

export function PublicFooter() {
  const footerLinks = {
    "Việc làm": [
      { name: "Tìm việc làm", href: "/jobs" },
      { name: "Việc làm IT", href: "/jobs?category=it" },
      { name: "Việc làm Marketing", href: "/jobs?category=marketing" },
      { name: "Việc làm Bán hàng", href: "/jobs?category=sales" },
    ],
    "Công ty": [
      { name: "Danh sách công ty", href: "/companies" },
      { name: "Đăng tin tuyển dụng", href: "/register?role=employer" },
      { name: "Gói dịch vụ", href: "/pricing" },
    ],
    "Hỗ trợ": [
      { name: "Liên hệ", href: "/contact" },
      { name: "Hướng dẫn", href: "/help" },
      { name: "Câu hỏi thường gặp", href: "/faq" },
    ],
    "Pháp lý": [
      { name: "Điều khoản sử dụng", href: "/terms" },
      { name: "Chính sách bảo mật", href: "/privacy" },
      { name: "Chính sách cookie", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-6 w-6" />
              <span className="font-bold text-xl">JobBoard</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Nền tảng tuyển dụng hàng đầu Việt Nam, kết nối ứng viên với nhà
              tuyển dụng.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contact@jobboard.vn</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 JobBoard. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Điều khoản
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
