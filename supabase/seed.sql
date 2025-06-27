-- Seed data for Job Board MVP
-- Companies and Jobs with real Vietnamese market data

-- Insert companies with real logos and information
insert into public.companies (id, name, slug, description, website, logo_url, industry, location, email, verified, created_at) values
  (
    'b8c5a5d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d'::uuid,
    'FPT Software',
    'fpt-software',
    'FPT Software là công ty phần mềm hàng đầu Việt Nam, cung cấp dịch vụ phát triển phần mềm, chuyển đổi số và giải pháp công nghệ cho khách hàng toàn cầu.',
    'https://www.fpt-software.com',
    'https://www.fpt-software.com/wp-content/uploads/2019/06/FPT-Logo.png',
    'Công nghệ thông tin',
    'Hồ Chí Minh',
    'careers@fpt-software.com',
    true,
    now()
  ),
  (
    'c9d6b6e3-4f5a-6b7c-8d9e-0f1a2b3c4d5e'::uuid,
    'Vietcombank',
    'vietcombank',
    'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank) là một trong những ngân hàng thương mại lớn nhất và uy tín nhất tại Việt Nam.',
    'https://www.vietcombank.com.vn',
    'https://portal.vietcombank.com.vn/content/dam/vcb/logo/VCB-logo.svg',
    'Tài chính - Ngân hàng',
    'Hà Nội',
    'tuyendung@vietcombank.com.vn',
    true,
    now()
  ),
  (
    'daeb7c4f-5a60-7c8d-9e0f-1a2b3c4d5e6f'::uuid,
    'Shopee',
    'shopee',
    'Shopee là sàn thương mại điện tử hàng đầu Đông Nam Á và Đài Loan, cung cấp nền tảng mua sắm trực tuyến với trải nghiệm được cá nhân hóa, tích hợp và thú vị.',
    'https://shopee.vn',
    'https://cf.shopee.vn/file/c8e2675737c04e6b2b2c32a89bb18cc8',
    'Thương mại điện tử',
    'Hồ Chí Minh',
    'careers.vietnam@shopee.com',
    true,
    now()
  ),
  (
    'ebfc8d5a-6b71-8d9e-0f1a-2b3c4d5e6f7a'::uuid,
    'VinGroup',
    'vingroup',
    'VinGroup là tập đoàn kinh tế tư nhân đa ngành lớn nhất Việt Nam, hoạt động trong các lĩnh vực công nghệ, công nghiệp, bất động sản và dịch vụ.',
    'https://www.vingroup.net',
    'https://www.vingroup.net/sites/default/files/logo_0.png',
    'Bất động sản',
    'Hà Nội',
    'tuyendung@vingroup.net',
    true,
    now()
  ),
  (
    'fc0d9e6b-7c82-9e0f-1a2b-3c4d5e6f7a8b'::uuid,
    'TikTok',
    'tiktok',
    'TikTok là nền tảng video ngắn hàng đầu thế giới, nơi mọi người có thể khám phá, tạo và chia sẻ các video sáng tạo với cộng đồng toàn cầu.',
    'https://www.tiktok.com',
    'https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/8152caf0c8e8bc67ae0d.png',
    'Truyền thông - Media',
    'Hồ Chí Minh',
    'jobs-vn@tiktok.com',
    true,
    now()
  ),
  (
    '0d1e0f7c-8d93-0f1a-2b3c-4d5e6f7a8b9c'::uuid,
    'Grab',
    'grab',
    'Grab là siêu ứng dụng hàng đầu Đông Nam Á, cung cấp dịch vụ đi lại, giao đồ ăn, thanh toán và các dịch vụ khác phục vụ hàng triệu người dùng.',
    'https://www.grab.com',
    'https://assets.grab.com/wp-content/uploads/sites/9/2022/08/11174909/Grab_Green_lockup_ver.png',
    'Công nghệ thông tin',
    'Hồ Chí Minh',
    'careers@grab.com',
    true,
    now()
  ),
  (
    '1e2f1a8d-9e04-1a2b-3c4d-5e6f7a8b9c0d'::uuid,
    'VNG Corporation',
    'vng-corporation',
    'VNG là công ty công nghệ và giải trí trực tuyến hàng đầu Việt Nam, nổi tiếng với các sản phẩm như Zalo, 123pay và nhiều game online phổ biến.',
    'https://www.vng.com.vn',
    'https://www.vng.com.vn/wp-content/uploads/2019/08/VNG_logo.png',
    'Công nghệ thông tin',
    'Hồ Chí Minh',
    'hr@vng.com.vn',
    true,
    now()
  ),
  (
    '2f3a2b9e-0f15-2b3c-4d5e-6f7a8b9c0d1e'::uuid,
    'Momo',
    'momo',
    'MoMo là ví điện tử và nền tảng fintech hàng đầu Việt Nam, cung cấp các dịch vụ thanh toán, chuyển tiền và tài chính toàn diện.',
    'https://momo.vn',
    'https://momo.vn/uploads/momo-upload-api-200117-151814-637148854940878429.jpg',
    'Tài chính - Ngân hàng',
    'Hồ Chí Minh',
    'career@momo.vn',
    true,
    now()
  );

-- Insert jobs for the companies
insert into public.jobs (id, title, slug, description, requirements, salary_min, salary_max, currency, employment_type, experience_level, location, is_remote, status, company_id, created_by, published_at, application_count, created_at) values
  (
    'a1b2c3d4-e5f6-7890-1234-567890abcdef'::uuid,
    'Senior Frontend Developer (React)',
    'senior-frontend-developer-react-fpt',
    'Chúng tôi đang tìm kiếm Senior Frontend Developer có kinh nghiệm với React để tham gia phát triển các sản phẩm công nghệ cho khách hàng quốc tế. Bạn sẽ làm việc trong môi trường agile, sử dụng các công nghệ hiện đại và có cơ hội học hỏi từ đội ngũ kỹ sư giàu kinh nghiệm.',
    'Tối thiểu 3 năm kinh nghiệm phát triển Frontend với React
• Thành thạo JavaScript, TypeScript, HTML5, CSS3
• Kinh nghiệm với Redux, React Router, Webpack
• Hiểu biết về RESTful APIs và GraphQL
• Kinh nghiệm với Git, CI/CD
• Tiếng Anh giao tiếp tốt',
    25000000,
    40000000,
    'VND',
    'full_time',
    'senior',
    'Hồ Chí Minh',
    false,
    'published',
    'b8c5a5d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d'::uuid,
    null,
    now() - interval '2 days',
    15,
    now() - interval '2 days'
  ),
  (
    'b2c3d4e5-f6a7-8901-2345-678901bcdef0'::uuid,
    'Business Analyst - Digital Banking',
    'business-analyst-digital-banking-vcb',
    'Vietcombank đang tuyển dụng Business Analyst cho mảng ngân hàng số. Ứng viên sẽ tham gia phân tích nghiệp vụ, thiết kế quy trình và hỗ trợ phát triển các sản phẩm dịch vụ ngân hàng số hiện đại.',
    'Tốt nghiệp Đại học chuyên ngành Kinh tế, Tài chính, Ngân hàng hoặc IT
• Tối thiểu 2 năm kinh nghiệm trong lĩnh vực ngân hàng hoặc fintech
• Kiến thức về quy trình ngân hàng và sản phẩm dịch vụ tài chính
• Kỹ năng phân tích, thiết kế quy trình nghiệp vụ
• Thành thạo Excel, PowerPoint, Visio
• Tiếng Anh đọc hiểu tốt',
    18000000,
    28000000,
    'VND',
    'full_time',
    'mid',
    'Hà Nội',
    false,
    'published',
    'c9d6b6e3-4f5a-6b7c-8d9e-0f1a2b3c4d5e'::uuid,
    null,
    now() - interval '1 day',
    8,
    now() - interval '1 day'
  ),
  (
    'c3d4e5f6-a7b8-9012-3456-789012cdef01'::uuid,
    'Product Manager - E-commerce',
    'product-manager-ecommerce-shopee',
    'Shopee tuyển dụng Product Manager để phụ trách phát triển các tính năng sản phẩm trên nền tảng thương mại điện tử. Bạn sẽ làm việc với các team đa chức năng để đưa ra các giải pháp sáng tạo cho hàng triệu người dùng.',
    'Tốt nghiệp Đại học chuyên ngành liên quan
• Tối thiểu 3 năm kinh nghiệm Product Management
• Kinh nghiệm trong lĩnh vực e-commerce hoặc tech
• Kỹ năng phân tích dữ liệu và insight từ user behavior
• Hiểu biết về UX/UI và development process
• Tiếng Anh thành thạo',
    30000000,
    50000000,
    'VND',
    'full_time',
    'senior',
    'Hồ Chí Minh',
    true,
    'published',
    'daeb7c4f-5a60-7c8d-9e0f-1a2b3c4d5e6f'::uuid,
    null,
    now() - interval '3 days',
    23,
    now() - interval '3 days'
  ),
  (
    'd4e5f6a7-b8c9-0123-4567-890123def012'::uuid,
    'Software Engineer - VinSmart',
    'software-engineer-vinsmart-vingroup',
    'VinGroup tuyển dụng Software Engineer cho bộ phận VinSmart phát triển các sản phẩm IoT và smart devices. Ứng viên sẽ tham gia phát triển firmware, mobile apps và cloud services.',
    'Tốt nghiệp Đại học chuyên ngành CNTT, Điện tử viễn thông
• Kinh nghiệm với C/C++, Java hoặc Kotlin
• Hiểu biết về embedded systems, IoT protocols
• Kinh nghiệm phát triển mobile apps (Android/iOS) là lợi thế
• Kỹ năng làm việc nhóm và giải quyết vấn đề
• Đam mê công nghệ và sáng tạo',
    15000000,
    25000000,
    'VND',
    'full_time',
    'junior',
    'Hà Nội',
    false,
    'published',
    'ebfc8d5a-6b71-8d9e-0f1a-2b3c4d5e6f7a'::uuid,
    null,
    now() - interval '4 days',
    12,
    now() - interval '4 days'
  ),
  (
    'e5f6a7b8-c9d0-1234-5678-901234ef0123'::uuid,
    'Data Scientist - AI/ML',
    'data-scientist-ai-ml-tiktok',
    'TikTok đang tìm kiếm Data Scientist để tham gia phát triển các thuật toán AI/ML cho hệ thống recommendation và content moderation. Đây là cơ hội tuyệt vời để làm việc với big data và impact hàng tỷ người dùng.',
    'Thạc sĩ hoặc Cử nhân chuyên ngành Computer Science, Statistics, Mathematics
• Tối thiểu 2 năm kinh nghiệm với Machine Learning và Deep Learning
• Thành thạo Python, TensorFlow/PyTorch, SQL
• Kinh nghiệm với big data tools: Spark, Hadoop, Kafka
• Kiến thức về recommendation systems, NLP, computer vision
• Tiếng Anh thành thạo',
    35000000,
    60000000,
    'VND',
    'full_time',
    'senior',
    'Hồ Chí Minh',
    true,
    'published',
    'fc0d9e6b-7c82-9e0f-1a2b-3c4d5e6f7a8b'::uuid,
    null,
    now() - interval '1 day',
    31,
    now() - interval '1 day'
  ),
  (
    'f6a7b8c9-d0e1-2345-6789-012345f01234'::uuid,
    'Backend Developer - Go/Node.js',
    'backend-developer-go-nodejs-grab',
    'Grab Vietnam tuyển dụng Backend Developer để phát triển các microservices phục vụ hàng triệu giao dịch mỗi ngày. Bạn sẽ làm việc với các công nghệ cloud-native và distributed systems.',
    'Tối thiểu 2 năm kinh nghiệm backend development
• Thành thạo Go, Node.js hoặc Java
• Kinh nghiệm với microservices architecture
• Hiểu biết về Docker, Kubernetes, AWS/GCP
• Kinh nghiệm với databases: PostgreSQL, Redis, MongoDB
• Kỹ năng debug và optimization',
    20000000,
    35000000,
    'VND',
    'full_time',
    'mid',
    'Hồ Chí Minh',
    false,
    'published',
    '0d1e0f7c-8d93-0f1a-2b3c-4d5e6f7a8b9c'::uuid,
    null,
    now() - interval '2 days',
    19,
    now() - interval '2 days'
  ),
  (
    'a7b8c9d0-e1f2-3456-7890-123456012345'::uuid,
    'Game Developer - Unity',
    'game-developer-unity-vng',
    'VNG Corporation tuyển dụng Game Developer sử dụng Unity để phát triển mobile games. Ứng viên sẽ tham gia phát triển các tính năng gameplay, optimization và publishing.',
    'Tốt nghiệp Đại học chuyên ngành CNTT hoặc liên quan
• Tối thiểu 1 năm kinh nghiệm phát triển game với Unity
• Thành thạo C#, Unity Engine, Unity UI
• Hiểu biết về game design patterns và optimization
• Kinh nghiệm với mobile game development (iOS/Android)
• Đam mê game và có tư duy sáng tạo',
    15000000,
    30000000,
    'VND',
    'full_time',
    'junior',
    'Hồ Chí Minh',
    false,
    'published',
    '1e2f1a8d-9e04-1a2b-3c4d-5e6f7a8b9c0d'::uuid,
    null,
    now() - interval '5 days',
    7,
    now() - interval '5 days'
  ),
  (
    'b8c9d0e1-f2a3-4567-8901-234567012346'::uuid,
    'Mobile Developer - React Native',
    'mobile-developer-react-native-momo',
    'MoMo đang tuyển dụng Mobile Developer có kinh nghiệm với React Native để phát triển ứng dụng ví điện tử hàng đầu Việt Nam. Bạn sẽ làm việc với team product để mang đến trải nghiệm tốt nhất cho người dùng.',
    'Tối thiểu 2 năm kinh nghiệm phát triển mobile app
• Thành thạo React Native, JavaScript, TypeScript
• Kinh nghiệm với native modules (iOS/Android)
• Hiểu biết về mobile app optimization và security
• Kinh nghiệm với fintech/payment là lợi thế
• Kỹ năng làm việc nhóm và communication',
    22000000,
    38000000,
    'VND',
    'full_time',
    'mid',
    'Hồ Chí Minh',
    true,
    'published',
    '2f3a2b9e-0f15-2b3c-4d5e-6f7a8b9c0d1e'::uuid,
    null,
    now(),
    5,
    now()
  ),
  (
    'c9d0e1f2-a3b4-5678-9012-345678012347'::uuid,
    'DevOps Engineer - AWS',
    'devops-engineer-aws-fpt',
    'FPT Software tuyển dụng DevOps Engineer để quản lý và tối ưu hóa infrastructure trên AWS cho các dự án khách hàng quốc tế. Ứng viên sẽ làm việc với các công nghệ cloud hiện đại.',
    'Tối thiểu 2 năm kinh nghiệm DevOps/SysAdmin
• Thành thạo AWS services (EC2, S3, RDS, Lambda, etc.)
• Kinh nghiệm với Docker, Kubernetes, Terraform
• Hiểu biết về CI/CD pipelines (Jenkins, GitLab CI)
• Kỹ năng scripting (Bash, Python)
• AWS certification là lợi thế',
    18000000,
    32000000,
    'VND',
    'full_time',
    'mid',
    'Hồ Chí Minh',
    false,
    'published',
    'b8c5a5d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d'::uuid,
    null,
    now() - interval '6 days',
    11,
    now() - interval '6 days'
  ),
  (
    'd0e1f2a3-b4c5-6789-0123-456789012348'::uuid,
    'Internship - Full Stack Developer',
    'internship-fullstack-developer-shopee',
    'Shopee mở chương trình thực tập sinh Full Stack Developer dành cho sinh viên năm cuối. Đây là cơ hội tuyệt vời để học hỏi và phát triển kỹ năng trong môi trường công nghệ hàng đầu.',
    'Sinh viên năm 3, 4 chuyên ngành CNTT hoặc liên quan
• Kiến thức cơ bản về web development (HTML, CSS, JavaScript)
• Có hiểu biết về React, Node.js là lợi thế
• Kỹ năng học hỏi nhanh và làm việc nhóm
• Có thể full-time tối thiểu 3 tháng
• Đam mê công nghệ và phát triển sản phẩm',
    8000000,
    12000000,
    'VND',
    'internship',
    'entry',
    'Hồ Chí Minh',
    false,
    'published',
    'daeb7c4f-5a60-7c8d-9e0f-1a2b3c4d5e6f'::uuid,
    null,
    now() - interval '1 day',
    28,
    now() - interval '1 day'
  ),
  -- Additional 20 jobs
  (
    'e1f2a3b4-c5d6-7890-1234-567890012349'::uuid,
    'Senior Java Developer',
    'senior-java-developer-fpt',
    'FPT Software tuyển dụng Senior Java Developer để phát triển các hệ thống enterprise cho khách hàng tài chính và ngân hàng. Ứng viên sẽ làm việc với Spring Framework và microservices architecture.',
    'Tối thiểu 4 năm kinh nghiệm Java development
• Thành thạo Spring Boot, Spring Security, Spring Data
• Kinh nghiệm với microservices và distributed systems
• Hiểu biết về database design và optimization
• Kinh nghiệm với Apache Kafka, Redis
• Tiếng Anh giao tiếp tốt',
    28000000,
    45000000,
    'VND',
    'full_time',
    'senior',
    'Hà Nội',
    false,
    'published',
    'b8c5a5d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d'::uuid,
    null,
    now() - interval '3 days',
    9,
    now() - interval '3 days'
  ),
  (
    'f2a3b4c5-d6e7-8901-2345-678901012350'::uuid,
    'Digital Marketing Manager',
    'digital-marketing-manager-shopee',
    'Shopee Vietnam tuyển dụng Digital Marketing Manager để quản lý các chiến dịch marketing đa kênh. Ứng viên sẽ chịu trách nhiệm phát triển và thực hiện strategies để tăng trưởng user acquisition.',
    'Tối thiểu 3 năm kinh nghiệm Digital Marketing
• Kinh nghiệm với Facebook Ads, Google Ads, TikTok Ads
• Kỹ năng phân tích dữ liệu với Google Analytics, Facebook Analytics
• Hiểu biết về e-commerce và customer journey
• Kỹ năng quản lý team và project management
• Khả năng làm việc trong môi trường fast-paced',
    20000000,
    35000000,
    'VND',
    'full_time',
    'senior',
    'Hồ Chí Minh',
    false,
    'published',
    'daeb7c4f-5a60-7c8d-9e0f-1a2b3c4d5e6f'::uuid,
    null,
    now() - interval '2 days',
    14,
    now() - interval '2 days'
  ),
  (
    'a3b4c5d6-e7f8-9012-3456-789012012351'::uuid,
    'Credit Risk Analyst',
    'credit-risk-analyst-vietcombank',
    'Vietcombank tuyển dụng Credit Risk Analyst để phân tích và đánh giá rủi ro tín dụng. Ứng viên sẽ sử dụng các mô hình thống kê và machine learning để hỗ trợ quyết định cho vay.',
    'Tốt nghiệp Đại học chuyên ngành Tài chính, Kinh tế, Toán học
• Tối thiểu 2 năm kinh nghiệm phân tích rủi ro hoặc data analysis
• Thành thạo Excel, SQL, Python hoặc R
• Hiểu biết về quy định Basel II/III
• Kỹ năng phân tích định lượng và xây dựng mô hình
• Chứng chỉ FRM, CFA là lợi thế',
    15000000,
    25000000,
    'VND',
    'full_time',
    'mid',
    'Hà Nội',
    false,
    'published',
    'c9d6b6e3-4f5a-6b7c-8d9e-0f1a2b3c4d5e'::uuid,
    null,
    now() - interval '4 days',
    6,
    now() - interval '4 days'
  ),
  (
    'b4c5d6e7-f8a9-0123-4567-890123012352'::uuid,
    'UI/UX Designer',
    'ui-ux-designer-grab',
    'Grab Vietnam tuyển dụng UI/UX Designer để thiết kế trải nghiệm người dùng cho các sản phẩm digital. Ứng viên sẽ làm việc với product teams để tạo ra designs có impact cao.',
    'Tối thiểu 2 năm kinh nghiệm UI/UX Design
• Thành thạo Figma, Sketch, Adobe Creative Suite
• Portfolio mạnh về mobile app và web design
• Hiểu biết về design systems và user research
• Kinh nghiệm với prototyping và usability testing
• Tư duy design thinking và problem-solving',
    18000000,
    30000000,
    'VND',
    'full_time',
    'mid',
    'Hồ Chí Minh',
    true,
    'published',
    '0d1e0f7c-8d93-0f1a-2b3c-4d5e6f7a8b9c'::uuid,
    null,
    now() - interval '1 day',
    22,
    now() - interval '1 day'
  ),
  (
    'c5d6e7f8-a9b0-1234-5678-901234012353'::uuid,
    'Business Development Executive',
    'business-development-executive-vingroup',
    'VinGroup tuyển dụng Business Development Executive để mở rộng quan hệ đối tác và phát triển thị trường mới. Ứng viên sẽ đàm phán các deal lớn và xây dựng strategic partnerships.',
    'Tốt nghiệp Đại học chuyên ngành Kinh doanh, Marketing
• Tối thiểu 3 năm kinh nghiệm Sales hoặc Business Development
• Kỹ năng đàm phán và presentation xuất sắc
• Network rộng trong ngành bất động sản/retail
• Khả năng làm việc độc lập và đạt KPI
• Tiếng Anh thành thạo',
    20000000,
    40000000,
    'VND',
    'full_time',
    'senior',
    'Hà Nội',
    false,
    'published',
    'ebfc8d5a-6b71-8d9e-0f1a-2b3c4d5e6f7a'::uuid,
    null,
    now() - interval '5 days',
    11,
    now() - interval '5 days'
  ),
  (
    'd6e7f8a9-b0c1-2345-6789-012345012354'::uuid,
    'Content Creator - Video',
    'content-creator-video-tiktok',
    'TikTok tuyển dụng Content Creator chuyên về video content để sản xuất nội dung sáng tạo cho platform. Ứng viên sẽ làm việc với creators và brands để tạo ra viral content.',
    'Kinh nghiệm tối thiểu 1 năm trong lĩnh vực content creation
• Thành thạo các công cụ edit video: Adobe Premiere, After Effects
• Hiểu biết sâu về TikTok trends và viral content
• Kỹ năng storytelling và creative thinking
• Khả năng làm việc với tight deadlines
• Passion for social media và digital content',
    12000000,
    20000000,
    'VND',
    'full_time',
    'junior',
    'Hồ Chí Minh',
    true,
    'published',
    'fc0d9e6b-7c82-9e0f-1a2b-3c4d5e6f7a8b'::uuid,
    null,
    now() - interval '2 days',
    35,
    now() - interval '2 days'
  ),
  (
    'e7f8a9b0-c1d2-3456-7890-123456012355'::uuid,
    'QA Engineer - Automation',
    'qa-engineer-automation-vng',
    'VNG Corporation tuyển dụng QA Engineer chuyên về test automation cho các sản phẩm game và app. Ứng viên sẽ xây dựng framework testing và đảm bảo chất lượng sản phẩm.',
    'Tối thiểu 2 năm kinh nghiệm QA/Testing
• Kinh nghiệm với automation tools: Selenium, Appium
• Thành thạo một ngôn ngữ lập trình: Java, Python, JavaScript
• Hiểu biết về CI/CD và DevOps practices
• Kinh nghiệm test mobile apps và web applications
• Mindset detail-oriented và systematic thinking',
    16000000,
    28000000,
    'VND',
    'full_time',
    'mid',
    'Hồ Chí Minh',
    false,
    'published',
    '1e2f1a8d-9e04-1a2b-3c4d-5e6f7a8b9c0d'::uuid,
    null,
    now() - interval '3 days',
    13,
    now() - interval '3 days'
  ),
  (
    'f8a9b0c1-d2e3-4567-8901-234567012356'::uuid,
    'Financial Analyst',
    'financial-analyst-momo',
    'MoMo tuyển dụng Financial Analyst để phân tích performance tài chính và hỗ trợ strategic planning. Ứng viên sẽ làm việc với các teams để optimize financial operations của fintech platform.',
    'Tốt nghiệp Đại học chuyên ngành Tài chính, Kế toán
• Tối thiểu 1 năm kinh nghiệm financial analysis
• Thành thạo Excel, PowerBI, SQL
• Hiểu biết về fintech business model
• Kỹ năng phân tích và presentation
• CFA Level 1 hoặc ACCA là lợi thế',
    14000000,
    22000000,
    'VND',
    'full_time',
    'junior',
    'Hồ Chí Minh',
    false,
    'published',
    '2f3a2b9e-0f15-2b3c-4d5e-6f7a8b9c0d1e'::uuid,
    null,
    now() - interval '1 day',
    8,
    now() - interval '1 day'
  ),
  (
    'a9b0c1d2-e3f4-5678-9012-345678012357'::uuid,
    'Sales Manager - Enterprise',
    'sales-manager-enterprise-fpt',
    'FPT Software tuyển dụng Sales Manager để phụ trách khách hàng doanh nghiệp lớn. Ứng viên sẽ develop new business opportunities và maintain relationships với enterprise clients.',
    'Tối thiểu 4 năm kinh nghiệm sales trong IT/software
• Track record đạt được sales targets
• Hiểu biết về enterprise software solutions
• Kỹ năng presentation và communication xuất sắc
• Network với enterprise customers
• MBA hoặc relevant certifications là lợi thế',
    25000000,
    50000000,
    'VND',
    'full_time',
    'senior',
    'Hồ Chí Minh',
    false,
    'published',
    'b8c5a5d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d'::uuid,
    null,
    now() - interval '4 days',
    7,
    now() - interval '4 days'
  ),
  (
    'b0c1d2e3-f4a5-6789-0123-456789012358'::uuid,
    'HR Business Partner',
    'hr-business-partner-shopee',
    'Shopee tuyển dụng HR Business Partner để support business units trong talent management và organizational development. Ứng viên sẽ act as strategic advisor cho management team.',
    'Tốt nghiệp Đại học chuyên ngành Nhân sự, Tâm lý học
• Tối thiểu 3 năm kinh nghiệm HR trong tech companies
• Kinh nghiệm với talent acquisition và performance management
• Kỹ năng coaching và conflict resolution
• Hiểu biết về employment law và HR best practices
• Strong interpersonal và communication skills',
    18000000,
    30000000,
    'VND',
    'full_time',
    'senior',
    'Hồ Chí Minh',
    false,
    'published',
    'daeb7c4f-5a60-7c8d-9e0f-1a2b3c4d5e6f'::uuid,
    null,
    now() - interval '6 days',
    12,
    now() - interval '6 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-1234-567890012359'::uuid,
    'Compliance Officer',
    'compliance-officer-vietcombank',
    'Vietcombank tuyển dụng Compliance Officer để đảm bảo tuân thủ các quy định pháp luật và chính sách nội bộ. Ứng viên sẽ monitor compliance risks và develop control procedures.',
    'Tốt nghiệp Đại học Luật, Tài chính ngân hàng
• Tối thiểu 2 năm kinh nghiệm compliance trong ngân hàng
• Hiểu biết sâu về banking regulations và Basel frameworks
• Kỹ năng phân tích rủi ro và internal audit
• Kinh nghiệm với regulatory reporting
• Chứng chỉ chuyên môn về compliance là lợi thế',
    16000000,
    26000000,
    'VND',
    'full_time',
    'mid',
    'Hà Nội',
    false,
    'published',
    'c9d6b6e3-4f5a-6b7c-8d9e-0f1a2b3c4d5e'::uuid,
    null,
    now() - interval '3 days',
    5,
    now() - interval '3 days'
  ),
  (
    'd2e3f4a5-b6c7-8901-2345-678901012360'::uuid,
    'Operations Manager - Logistics',
    'operations-manager-logistics-grab',
    'Grab Vietnam tuyển dụng Operations Manager cho mảng logistics và delivery. Ứng viên sẽ optimize operations efficiency và manage network của drivers và merchants.',
    'Tốt nghiệp Đại học chuyên ngành Logistics, Quản trị kinh doanh
• Tối thiểu 3 năm kinh nghiệm operations trong logistics/e-commerce
• Kinh nghiệm với data analysis và process optimization
• Hiểu biết về supply chain management
• Kỹ năng leadership và team management
• Khả năng làm việc trong môi trường dynamic',
    22000000,
    35000000,
    'VND',
    'full_time',
    'senior',
    'Hồ Chí Minh',
    false,
    'published',
    '0d1e0f7c-8d93-0f1a-2b3c-4d5e6f7a8b9c'::uuid,
    null,
    now() - interval '2 days',
    16,
    now() - interval '2 days'
  ),
  (
    'e3f4a5b6-c7d8-9012-3456-789012012361'::uuid,
    'Project Manager - Smart City',
    'project-manager-smart-city-vingroup',
    'VinGroup tuyển dụng Project Manager cho các dự án Smart City và IoT. Ứng viên sẽ coordinate các stakeholders và ensure successful delivery của complex tech projects.',
    'Tốt nghiệp Đại học chuyên ngành CNTT, Quản trị dự án
• Tối thiểu 4 năm kinh nghiệm project management
• PMP hoặc Agile/Scrum certifications
• Kinh nghiệm với IoT, smart city solutions
• Kỹ năng stakeholder management và risk management
• Khả năng work with cross-functional teams',
    25000000,
    40000000,
    'VND',
    'full_time',
    'senior',
    'Hà Nội',
    false,
    'published',
    'ebfc8d5a-6b71-8d9e-0f1a-2b3c4d5e6f7a'::uuid,
    null,
    now() - interval '7 days',
    9,
    now() - interval '7 days'
  ),
  (
    'f4a5b6c7-d8e9-0123-4567-890123012362'::uuid,
    'Machine Learning Engineer',
    'machine-learning-engineer-tiktok',
    'TikTok tuyển dụng ML Engineer để phát triển và deploy các ML models cho recommendation system và content understanding. Ứng viên sẽ work với petabyte-scale data.',
    'Thạc sĩ Computer Science, AI hoặc tương đương
• Tối thiểu 3 năm kinh nghiệm ML engineering
• Expert level Python, TensorFlow/PyTorch
• Kinh nghiệm với distributed computing: Spark, Kubernetes
• Hiểu biết về MLOps và model deployment
• Publications hoặc contributions to open source là lợi thế',
    40000000,
    70000000,
    'VND',
    'full_time',
    'senior',
    'Hồ Chí Minh',
    true,
    'published',
    'fc0d9e6b-7c82-9e0f-1a2b-3c4d5e6f7a8b'::uuid,
    null,
    now() - interval '1 day',
    45,
    now() - interval '1 day'
  ),
  (
    'a5b6c7d8-e9f0-1234-5678-901234012363'::uuid,
    'Game Designer',
    'game-designer-vng',
    'VNG Corporation tuyển dụng Game Designer để thiết kế gameplay mechanics và features cho mobile games. Ứng viên sẽ collaborate với artists và developers để create engaging game experiences.',
    'Tốt nghiệp chuyên ngành Game Design, Digital Arts hoặc liên quan
• Tối thiểu 2 năm kinh nghiệm game design
• Portfolio mạnh về game concepts và prototypes
• Hiểu biết về game monetization và player psychology
• Kỹ năng sử dụng Unity, Unreal Engine
• Passion for games và creative mindset',
    18000000,
    32000000,
    'VND',
    'full_time',
    'mid',
    'Hồ Chí Minh',
    false,
    'published',
    '1e2f1a8d-9e04-1a2b-3c4d-5e6f7a8b9c0d'::uuid,
    null,
    now() - interval '4 days',
    21,
    now() - interval '4 days'
  ),
  (
    'b6c7d8e9-f0a1-2345-6789-012345012364'::uuid,
    'Senior Product Owner',
    'senior-product-owner-momo',
    'MoMo tuyển dụng Senior Product Owner để lead product development cho fintech solutions. Ứng viên sẽ define product roadmap và ensure alignment với business objectives.',
    'Tối thiểu 4 năm kinh nghiệm Product Owner/Product Manager
• Kinh nghiệm trong fintech hoặc payment industry
• Thành thạo Agile/Scrum methodologies
• Strong analytical skills và data-driven mindset
• Kinh nghiệm với user research và A/B testing
• Excellent stakeholder management skills',
    30000000,
    50000000,
    'VND',
    'full_time',
    'senior',
    'Hồ Chí Minh',
    false,
    'published',
    '2f3a2b9e-0f15-2b3c-4d5e-6f7a8b9c0d1e'::uuid,
    null,
    now() - interval '2 days',
    18,
    now() - interval '2 days'
  ),
  (
    'c7d8e9f0-a1b2-3456-7890-123456012365'::uuid,
    'Technical Writer',
    'technical-writer-fpt',
    'FPT Software tuyển dụng Technical Writer để tạo documentation cho software products và APIs. Ứng viên sẽ work closely với engineering teams để create clear technical content.',
    'Tốt nghiệp Đại học chuyên ngành English, Journalism, CS
• Tối thiểu 2 năm kinh nghiệm technical writing
• Excellent English writing skills
• Hiểu biết về software development lifecycle
• Kinh nghiệm với documentation tools: Confluence, GitBook
• Ability to explain complex technical concepts simply',
    15000000,
    25000000,
    'VND',
    'full_time',
    'mid',
    'Hà Nội',
    true,
    'published',
    'b8c5a5d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d'::uuid,
    null,
    now() - interval '5 days',
    7,
    now() - interval '5 days'
  ),
  (
    'd8e9f0a1-b2c3-4567-8901-234567012366'::uuid,
    'Customer Success Manager',
    'customer-success-manager-shopee',
    'Shopee tuyển dụng Customer Success Manager để ensure seller success trên platform. Ứng viên sẽ support key accounts và drive retention through relationship building.',
    'Tốt nghiệp Đại học chuyên ngành Kinh doanh, Marketing
• Tối thiểu 2 năm kinh nghiệm customer success hoặc account management
• Strong communication và relationship building skills
• Hiểu biết về e-commerce ecosystem
• Data analysis skills để track customer health metrics
• Customer-centric mindset và problem-solving abilities',
    16000000,
    28000000,
    'VND',
    'full_time',
    'mid',
    'Hồ Chí Minh',
    false,
    'published',
    'daeb7c4f-5a60-7c8d-9e0f-1a2b3c4d5e6f'::uuid,
    null,
    now() - interval '3 days',
    14,
    now() - interval '3 days'
  ),
  (
    'e9f0a1b2-c3d4-5678-9012-345678012367'::uuid,
    'Cybersecurity Analyst',
    'cybersecurity-analyst-vietcombank',
    'Vietcombank tuyển dụng Cybersecurity Analyst để monitor và protect bank systems khỏi cyber threats. Ứng viên sẽ implement security measures và respond to incidents.',
    'Tốt nghiệp Đại học chuyên ngành CNTT, An toàn thông tin
• Tối thiểu 2 năm kinh nghiệm cybersecurity
• Kiến thức về security frameworks: ISO 27001, NIST
• Kinh nghiệm với SIEM tools và incident response
• Security certifications: CISSP, CEH là lợi thế
• Strong analytical và problem-solving skills',
    20000000,
    35000000,
    'VND',
    'full_time',
    'mid',
    'Hà Nội',
    false,
    'published',
    'c9d6b6e3-4f5a-6b7c-8d9e-0f1a2b3c4d5e'::uuid,
    null,
    now() - interval '4 days',
    8,
    now() - interval '4 days'
  ),
  (
    'f0a1b2c3-d4e5-6789-0123-456789012368'::uuid,
    'Supply Chain Analyst',
    'supply-chain-analyst-grab',
    'Grab Vietnam tuyển dụng Supply Chain Analyst để optimize logistics network và reduce delivery costs. Ứng viên sẽ analyze data để improve operational efficiency.',
    'Tốt nghiệp Đại học chuyên ngành Supply Chain, Industrial Engineering
• Tối thiểu 1 năm kinh nghiệm supply chain analysis
• Thành thạo Excel, SQL, Tableau/PowerBI
• Hiểu biết về logistics operations và delivery optimization
• Strong quantitative analysis skills
• Experience với transportation management systems',
    14000000,
    24000000,
    'VND',
    'full_time',
    'junior',
    'Hồ Chí Minh',
    false,
    'published',
    '0d1e0f7c-8d93-0f1a-2b3c-4d5e6f7a8b9c'::uuid,
    null,
    now() - interval '1 day',
    11,
    now() - interval '1 day'
  );
