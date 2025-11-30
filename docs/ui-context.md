# Leaply - UI Context

## 1. Tổng quan UX Flow

```
Landing → Sign Up → Onboarding (5 bước) → Home → Explore Universities → Dashboard/Applications → Persona Lab
```

**Flow chi tiết:**
- **Khách (chưa đăng nhập):** Landing → Features → About → Sign Up / Login
- **Người dùng mới:** Sign Up → Onboarding 5 bước → Universities (AI Match)
- **Người dùng đã có profile:** Home → Universities / Dashboard / Persona Lab (tự do điều hướng)

---

## 2. Công nghệ Sử dụng

| Layer | Công nghệ |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| State | Zustand (persist to localStorage) |
| Icons | Lucide React |
| i18n | Custom hook (EN/VI) |

**Lưu ý:** Demo không gọi API thực - tất cả dữ liệu mock trong Zustand stores.

---

## 3. Thiết kế Ý tưởng Các Chức năng

### 3.1 Onboarding - Thu thập Profile
**Mục đích:** Xây dựng hồ sơ học sinh để AI matching và personalization.

**5 bước:**
1. **Basic Info:** Tên, email, trình độ hiện tại, bằng cấp mục tiêu
2. **Academic:** GPA, điểm test chuẩn hóa (IELTS/TOEFL, SAT/ACT)
3. **Goals:** Ngành học mong muốn, career goals
4. **Journey:** Timeline dự kiến, quốc gia ưu tiên, budget
5. **Quiz:** Câu hỏi preference (môi trường học tập, size trường, culture)

### 3.2 University Discovery - Hai chế độ
**AI Match Mode:**
- Hiển thị trường được AI gợi ý dựa trên profile
- Mỗi trường có Fit Score (%) và Match Reasons
- Click "Why?" để xem chi tiết lý do AI đề xuất

**Explore All Mode:**
- Tự do duyệt toàn bộ database
- Filter theo Region, Major, Tuition range
- Sort theo ranking

### 3.3 Persona Lab - Khám phá bản thân
**Ý tưởng:** Giả lập quy trình mentor thật - đặt câu hỏi gợi mở để học sinh tự khám phá "câu chuyện" của mình.

**3 tab:**
- **Discovery:** Hoàn thành 4 tracks câu hỏi
- **My Persona:** Tổng hợp insights từ câu trả lời
- **Essays:** Brainstorm và viết essay với AI support

### 3.4 Dashboard - Quản lý Application
**Overview:** Stats tổng quan (trường đã save, applications, tasks)
**Applications:** Sidebar list + Detail view với timeline, tasks, documents
**Tasks:** To-do list với deadline và priority

---

## 4. Nội dung Chi tiết Các Phần Quan trọng

### 4.1 Onboarding - Dữ liệu Thu thập

| Bước | Fields |
|------|--------|
| Basic Info | fullName, email, currentEducationLevel (High School/Undergraduate/Graduate), targetDegree (Bachelor/Master/PhD) |
| Academic | GPA (scale), IELTS/TOEFL score, SAT/ACT score (optional) |
| Goals | intendedMajor, careerGoals, interests |
| Journey | targetYear, preferredCountries[], budget range, scholarship preference |
| Quiz | learningStyle, campusSize preference, culture fit questions |

### 4.2 University Data - Hiển thị

**Card View (danh sách):**
- Logo + Country flag
- Name, City, Country
- Ranking badge (#1, #2...)
- Tuition/năm
- Fit Score % (AI Match mode)
- Match reasons (3 bullet points)

**Detail Page:**
```
┌─────────────────────────────────────┐
│ Hero: Logo + Name + Location        │
│ Badges: Ranking, Type, Acceptance   │
├─────────────────────────────────────┤
│ Overview paragraph                  │
├─────────────────────────────────────┤
│ Programs Tab                        │
│ - Name, Level, Duration, Tuition    │
│ - Requirements                      │
├─────────────────────────────────────┤
│ Scholarships Tab                    │
│ - Name, Amount, Eligibility         │
├─────────────────────────────────────┤
│ Application Requirements Tab        │
│ - Type, Description, Deadline       │
├─────────────────────────────────────┤
│ Reviews Tab                         │
│ - Author, Rating, Comment           │
└─────────────────────────────────────┘
```

**Dữ liệu mỗi University:**
- Basic: name, country, region, city, ranking, logo, foundingYear, type (public/private), websiteUrl, acceptanceRate
- Finance: averageTuition
- Programs[]: name, level, duration, tuition, requirements[]
- Scholarships[]: name, amount, description, eligibility[]
- ApplicationRequirements[]: type, description, deadline
- Reviews[]: author, rating, comment, date

### 4.3 Persona Lab - Câu hỏi Discovery

**Track 1: Academic Journey (5 câu)**
1. Môn học nào khiến bạn hứng thú nhất? Tại sao?
2. Kể về một dự án học thuật hoặc nghiên cứu bạn tự hào nhất
3. Thử thách học thuật lớn nhất bạn đã vượt qua là gì?
4. Bạn học tốt nhất theo cách nào? (optional)
5. Nếu có thể nghiên cứu bất kỳ chủ đề nào, đó sẽ là gì?

**Track 2: Activities & Impact (5 câu)**
1. Hoạt động ngoại khóa nào bạn dành nhiều thời gian và tâm huyết nhất?
2. Bạn đã đóng vai trò lãnh đạo hoặc khởi xướng điều gì?
3. Kể về một lần bạn giúp đỡ người khác hoặc tạo ra sự thay đổi tích cực
4. Kỹ năng nào bạn đã phát triển qua các hoạt động này? (optional)
5. Nếu có thêm thời gian và nguồn lực, bạn muốn làm điều gì để giúp đỡ cộng đồng?

**Track 3: Values & Turning Points (5 câu)**
1. 3 giá trị quan trọng nhất với bạn là gì? Tại sao?
2. Kể về một trải nghiệm đã thay đổi cách bạn nhìn nhận cuộc sống
3. Ai là người ảnh hưởng lớn nhất đến bạn? Họ đã dạy bạn điều gì?
4. Bạn đã từng đối mặt với một quyết định khó khăn về đạo đức chưa? (optional)
5. Điều gì khiến bạn khác biệt so với những người xung quanh?

**Track 4: Future Vision (5 câu)**
1. Trong 10 năm nữa, bạn muốn đang làm gì?
2. Vấn đề nào trên thế giới bạn muốn góp phần giải quyết?
3. Tại sao bạn chọn học đại học ở nước ngoài?
4. Bạn muốn phát triển những kỹ năng hoặc kiến thức gì trong đại học? (optional)
5. Bạn muốn được nhớ đến như thế nào?

---

## 5. Giả lập Demo - Khả năng & Giới hạn

### Có thể giả lập:
| Chức năng | Cách giả lập |
|-----------|--------------|
| Auth (signup/login) | Zustand lưu vào localStorage, không validate thực |
| Onboarding | Form data lưu vào userStore |
| University list/filter | 21 universities mock data, filter client-side |
| Save university | Toggle state trong store |
| Fit Score | Tính toán client-side dựa trên profile vs university data |
| Application tracking | Mock applications với status, tasks, timeline |
| Persona Lab questions | Form flow lưu answers vào personaStore |

### Chưa giả lập / Placeholder:
| Chức năng | Tình trạng |
|-----------|------------|
| OAuth (Google/Facebook) | UI only, không functional |
| AI Chatbot | Chưa implement |
| AI Essay feedback | Placeholder |
| Document upload | UI only |
| Email verification | Không có |
| Real-time notifications | Không có |
| Payment | Không có |

### Data persistence:
- Tất cả state lưu localStorage qua Zustand persist
- Clear storage = reset toàn bộ data

---

## 6. Layout Các Trang Chức năng Chính

### Landing Page
```
┌─────────────────────────────────────┐
│ Navbar (Logo + Links + Auth)        │
├─────────────────────────────────────┤
│ Hero (Full-width, bg image)         │
│ - Badge + Title + Subtitle          │
│ - 2 CTA buttons                     │
│ - Stats row (3 metrics)             │
├─────────────────────────────────────┤
│ Universities Marquee (auto-scroll)  │
├─────────────────────────────────────┤
│ Features Grid (4 cards)             │
├─────────────────────────────────────┤
│ How It Works (2-column parallax)    │
│ Left: 4 steps scroll                │
│ Right: Sticky visual                │
├─────────────────────────────────────┤
│ CTA Section (pattern bg)            │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### Universities Page
```
┌─────────────────────────────────────┐
│ Navbar                              │
├─────────────────────────────────────┤
│ Hero + Search Bar                   │
├─────────────────────────────────────┤
│ Mode Tabs [AI Match] [Explore All]  │
├─────────────────────────────────────┤
│ (AI Match) Description + Grid       │
│ (Explore) Filters + Grid            │
│                                     │
│ ┌─────┐ ┌─────┐ ┌─────┐            │
│ │Card │ │Card │ │Card │ (3 cols)   │
│ └─────┘ └─────┘ └─────┘            │
└─────────────────────────────────────┘
```

### Dashboard Overview
```
┌─────────────────────────────────────┐
│ Navbar                              │
├─────────────────────────────────────┤
│ Page Header (Title + Description)   │
├─────────────────────────────────────┤
│ Stats Grid (4 cards)                │
│ [Saved][Apps][Tasks][Resources]     │
├───────────────────────┬─────────────┤
│ Recent Applications   │ Upcoming    │
│ (2/3 width)          │ Tasks       │
│                      │ (1/3 width) │
├───────────────────────┴─────────────┤
│ Quick Actions (3 buttons)           │
└─────────────────────────────────────┘
```

### Applications Page
```
┌────────────────┬────────────────────┐
│                │                    │
│   Sidebar      │   Detail View      │
│   (320px)      │   (flex-1)         │
│                │                    │
│   - New btn    │   - Uni header     │
│   - App list   │   - Status         │
│   - Status     │   - Timeline       │
│     filters    │   - Tasks          │
│                │   - Documents      │
│                │                    │
└────────────────┴────────────────────┘
```

### Persona Lab
```
┌────────────────┬────────────────────┐
│                │ Tab Header         │
│   Profile      │ [Discovery][Persona]
│   Context      │ [Essays]           │
│   Sidebar      ├────────────────────┤
│   (280px)      │                    │
│                │   Tab Content      │
│   - Summary    │   (Scrollable)     │
│   - Progress   │                    │
│   - Insights   │   - Track cards    │
│                │   - Question flow  │
│                │   - Essay editor   │
│                │                    │
└────────────────┴────────────────────┘
```

### Onboarding Steps
```
┌─────────────────────────────────────┐
│ Navbar                              │
├─────────────────────────────────────┤
│ Progress Stepper (1-2-3-4-5)        │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Card (centered, max-w-2xl)      │ │
│ │ - Icon + Title + Description    │ │
│ │ - Form fields                   │ │
│ │ - Back / Continue buttons       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 7. Responsive Behavior

| Breakpoint | Thay đổi chính |
|------------|----------------|
| Mobile (<768px) | 1 column, sidebar ẩn, hamburger menu |
| Tablet (768-1024px) | 2 columns grid |
| Desktop (>1024px) | Full layout, sidebars visible, 3 columns grid |
