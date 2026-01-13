# Explore Feature - MVP Specification

## 1. Overview

### Purpose
Giúp user tìm và so sánh programs phù hợp để đưa vào Dashboard quản lý tiến trình apply.

### Two Modes
| Mode | Target User | Description |
|------|-------------|-------------|
| AI Mode (Default) | Newbie, chưa biết bắt đầu từ đâu | Gợi ý 5 programs với explanation |
| Manual Mode | Đã có kinh nghiệm, biết mình cần gì | Filter/browse tự do |

### Entry Point
User chọn "Tôi đã có mục tiêu" ở onboarding → vào Explore (AI Mode default)

### User Persona (MVP Focus)
Practical Seekers - Cử nhân mới tốt nghiệp, Việt Nam focus:
- Ưu tiên chi phí hợp lý + có scholarship
- Cần ranking "đủ có tiếng" để về VN xin việc
- Quan tâm kỹ năng thực tế, cơ hội việc làm

---

## 2. Data Sources

### Available (MVP)
| Data | Source Table | Fields |
|------|--------------|--------|
| Program info | `programs` | name, degree_type, duration_months, language |
| Cost | `programs` | tuition_total_usd, tuition_annual_usd |
| Ranking | `universities` | ranking_qs_min/max, ranking_times_min/max |
| Deadlines | `program_intakes` | application_deadline, early_deadline |
| Requirements | `programs` | requirements (jsonb), english_proficiency_requirement, min_work_experience_years |
| Scholarships | `scholarships` | coverage_type, coverage_percentage, eligibility_type |
| Fit score | `applications` | fit_score, fit_breakdown (pre-computed) |

### Out of Scope (MVP)
- Living cost by location
- PSW/Post-study work visa info
- Job placement rate
- Local language requirements

---

## 3. AI Mode (Default)

### Overview
Màn hình mặc định khi user vào Explore. Hiển thị 5 programs được gợi ý dựa trên onboarding data.

### Input
Dữ liệu từ onboarding:
- Trình độ hiện tại
- Target degree
- Fields quan tâm (max 3)
- Regions
- Intake time
- Budget range

### Output: Grouped Recommendations

**Distribution cố định (MVP):** 2 An toàn / 2 Cố 1 chút / 1 Reach

| Bucket | Số lượng | Meaning |
|--------|----------|---------|
| An toàn | 2 | Profile đáp ứng đủ hoặc vượt requirements |
| Cố 1 chút | 2 | Thiếu 1-2 tiêu chí nhỏ, có thể cải thiện |
| Reach | 1 | Thử thách, cần nỗ lực nhiều nhưng không phải không thể |

### Recommendation Card

Mỗi card hiển thị:

**Header:**
- University name + flag
- Program name
- Bucket badge (An toàn / Cố 1 chút / Reach)

**Key Info:**
- Ranking tier
- Total cost + scholarship indicator
- Deadline gần nhất

**Explanation (2 phần):**

| Section | Content | Example |
|---------|---------|---------|
| Tại sao phù hợp | Các tiêu chí match với profile | "Phù hợp budget, ranking Top 100, đúng ngành Data Science, deadline còn 4 tháng" |
| Lưu ý | Risk hoặc điểm cần cải thiện | "GPA yêu cầu 3.2, cao hơn profile bạn 0.2 điểm. Cần IELTS 6.5." |

**Actions:**
- "Xem chi tiết" → mở Detail Drawer
- Checkbox → thêm vào Compare
- "Thêm vào Dashboard"

### Layout

```
┌─────────────────────────────────────────────┐
│  [Toggle: AI Mode ● | Manual Mode ○]        │
├─────────────────────────────────────────────┤
│                                             │
│  Gợi ý dành cho bạn                         │
│  Dựa trên: Data Science, Tây Âu, <1 tỷ     │
│                                             │
│  ── An toàn (2) ──────────────────────────  │
│  [Card 1]  [Card 2]                         │
│                                             │
│  ── Cố 1 chút (2) ────────────────────────  │
│  [Card 3]  [Card 4]                         │
│                                             │
│  ── Reach (1) ────────────────────────────  │
│  [Card 5]                                   │
│                                             │
├─────────────────────────────────────────────┤
│  [Compare Tray - sticky bottom]             │
└─────────────────────────────────────────────┘
```

### Empty State
Nếu AI không tìm được đủ 5 programs:
- Show những gì tìm được
- Message: "Chưa tìm thấy đủ gợi ý. Thử mở rộng tiêu chí trong phần Tự tìm kiếm."
- CTA: Switch sang Manual Mode

### Transition to Manual Mode
- Toggle ở top để switch
- Filter state trong Manual mode sẽ pre-fill từ onboarding data
- Có thể quay lại AI mode bất cứ lúc nào

---

## 4. Manual Mode

### Overview
Cho phép user tự filter/browse toàn bộ programs. Accessible via toggle từ AI Mode.

### Zone 1: Filter Bar (Top, Collapsed by Default)

**Always Visible (Quick Filters):**
- Search box: program/university name
- Ranking tier: Top 50 / 51-100 / 101-200 / 200+
- Budget: slider hoặc preset buckets
- Region: multi-select (pre-filled from onboarding)

**Expandable:**
- Field/Major: max 3 (pre-filled from onboarding)
- Intake: semester + year
- Eligibility toggle: "Chỉ hiện programs tôi đủ điều kiện"

### Zone 2: Results List (Main)

**Default Sort:** Ranking (cao → thấp)

**Row Structure (trái → phải):**
```
[Checkbox] [University + Program] [Ranking] [Cost] [Deadline] [Fit Badge]
```

| Element | Display |
|---------|---------|
| Checkbox | Select for compare |
| University + Program | Uni name + flag, Program name below |
| Ranking | QS tier badge (Top 50, 51-100, etc.) |
| Cost | Total USD + 💰 icon nếu có scholarship |
| Deadline | Date + urgency indicator |
| Fit Badge | An toàn / Cố 1 chút / Phải nỗ lực nhiều |

**Deadline Urgency Indicators:**
| Condition | Display |
|-----------|---------|
| < 14 ngày | ⚠️ đỏ + text đỏ "Còn X ngày" |
| 14-30 ngày | ⚠️ cam + text cam |
| > 30 ngày | Text bình thường |

**Fit Badge Colors:**
| Badge | Color | Meaning |
|-------|-------|---------|
| An toàn | Xanh | Profile đáp ứng đủ requirements |
| Cố 1 chút | Vàng | Thiếu 1-2 tiêu chí nhỏ, có thể cải thiện |
| Phải nỗ lực nhiều | Cam/Đỏ | Thiếu nhiều tiêu chí quan trọng |

### Zone 3: Compare Tray (Sticky Bottom)

**Hiển thị khi:** ≥1 program được checkbox

**Contents:**
- Mini chips của programs đã chọn (max 3)
- Button "So sánh (n)"
- Clear all link

---

## 5. Detail Drawer

**Trigger:** Click vào row (không phải checkbox)

**Position:** Slide-in từ phải

**Content Sections:**

### Header
- University name + logo
- Program name
- Ranking badge
- Fit badge

### Key Info
- Duration
- Language of instruction
- Start dates available

### Cost Breakdown
- Tuition total
- Scholarship available? (link to scholarship details)

### Requirements
- GPA minimum
- English proficiency (IELTS/TOEFL)
- Work experience (nếu có)
- Other requirements

### Fit Breakdown (Expandable)
- Những gì đã đạt ✓
- Những gì cần cải thiện (với CTA trong roadmap)

### Actions
- "Thêm vào so sánh" (nếu chưa có trong compare)
- "Thêm vào Dashboard"

---

## 6. Compare View

**Trigger:** Click "So sánh (n)" từ Compare Tray

**Layout:** Side-by-side columns, max 3 programs

**Comparison Rows:**

| Row | Description |
|-----|-------------|
| Header | Uni + Program name, Fit badge |
| Tổng chi phí | Tuition + scholarship indicator |
| Ranking | QS tier |
| Deadline | Gần nhất + urgency |
| GPA yêu cầu | Minimum GPA |
| English | IELTS/TOEFL requirement |
| Fit breakdown | Expandable: thiếu gì, cần cải thiện gì |

**Actions per Column:**
- "Thêm vào Dashboard"
- "Bỏ khỏi so sánh"

---

## 7. Empty State (Manual Mode)

**Trigger:** Filter quá chặt, không có results

**Logic suggest loosen (theo thứ tự):**

1. **Ranking** → "Không tìm thấy program nào. Thử mở rộng lên Top 200?"
2. **Region** → "Thử thêm khu vực khác?"
3. **Eligibility toggle** → "Tắt filter 'đủ điều kiện' để xem thêm options"

*Note: Không suggest loosen Budget vì khó thay đổi*

---

## 8. User Flow Summary

```
Onboarding (có mục tiêu)
    ↓
Explore - AI Mode (default)
    ↓
Xem 5 recommendations (2 An toàn / 2 Cố / 1 Reach)
    ↓
    ├── Hài lòng → Chọn → Detail/Compare → Dashboard
    │
    └── Muốn xem thêm → Toggle Manual Mode
                            ↓
                      Filter/Browse
                            ↓
                      Detail/Compare
                            ↓
                      Chọn → Dashboard
```

---

## 9. Technical Notes

### Fit Score Computation
- **Không dùng `applications` table** - vì user chưa tạo application khi browse
- Compute on-the-fly: API endpoint nhận `user_profile` + `program_id` → trả về score + breakdown
- Bucket mapping: score ranges → An toàn / Cố 1 chút / Phải nỗ lực nhiều
- Breakdown show: phần thiếu + có thể cải thiện

### Requirements Parsing
- Source: `programs.requirements` (jsonb)
- Structure cần backend confirm, expected format:
  ```json
  {
    "gpa_min": 3.0,
    "gpa_scale": 4.0,
    "ielts_min": 6.5,
    "toefl_min": 90,
    "documents": ["transcript", "cv", "sop"]
  }
  ```
- Frontend handle graceful fallback nếu fields missing
- Fallback display: "Xem chi tiết trên website trường"

### Scholarship Indicator
- Logic: Hiển thị 💰 nếu `scholarships.university_id` match với program's university
- **Không filter theo program-specific eligibility trong MVP**
- Click vào scholarship indicator → show list scholarships của university đó

### AI Recommendation Engine (MVP)
- Input: onboarding data (field, region, budget, intake, trình độ)
- Logic: Pure matching - programs khớp với criteria + fit score computation
- Output: 5 programs sorted into 3 buckets (2/2/1)
- Fallback: Nếu không đủ 5, show những gì có + suggest Manual Mode

### Pagination
- API đã có sẵn cho ~100+ programs
- Infinite scroll hoặc "Load more"

### State Management
- Filter state persist trong session
- Compare selection persist khi navigate giữa list ↔ drawer
- AI recommendations cached per session (không re-compute mỗi lần toggle)

---

## 10. Out of Scope (MVP)

- Chat/refine recommendations trong AI Mode
- Dynamic bucket distribution dựa trên profile strength
- Collaborative filtering ("người giống bạn thường chọn...")
- Saved searches
- Export/share comparison
- Notification khi deadline gần
- Living cost calculator
- Visa/PSW information