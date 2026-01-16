# Leaply Enum Reference

This document is the **single source of truth** for all enum values used across the Leaply platform.
All systems (Frontend, Admin, Backend) MUST use these exact values.

---

## Target Regions

User preference for study abroad regions.

| Enum Key | Vietnamese Label | English Label | Countries |
|----------|-----------------|---------------|-----------|
| `east_asia` | Đông Á | East Asia | China, South Korea, Japan, Taiwan, Hong Kong |
| `southeast_asia` | Đông Nam Á | Southeast Asia | Singapore, Malaysia, Thailand |
| `western_europe` | Tây Âu | Western Europe | UK, France, Netherlands |
| `central_europe` | Trung Âu | Central Europe | Germany, Austria, Switzerland |
| `northern_europe` | Bắc Âu | Northern Europe | Sweden, Denmark, Finland |
| `north_america` | Bắc Mỹ | North America | USA, Canada |
| `oceania` | Châu Đại Dương | Oceania | Australia, New Zealand |

**Source files:**
- Backend: `Leaply-BE/src/main/java/ai/leaply/onboarding/enums/TargetRegion.java`
- Frontend: `Leaply-FE/lib/constants/onboardingMappings.ts` → `REGION_LABEL_TO_KEY`

---

## Target Fields (Study Areas)

User preference for fields of study.

| Enum Key | Vietnamese Label | English Label |
|----------|-----------------|---------------|
| `cs_it` | Khoa học máy tính / IT | Computer Science / IT |
| `business` | Kinh doanh / Quản trị | Business / Management |
| `finance` | Kinh tế / Tài chính | Economics / Finance |
| `engineering` | Khoa học kỹ thuật | Engineering |
| `data_science` | Khoa học Dữ liệu / Phân tích | Data Science / Analytics |
| `design` | Thiết kế (UX/UI, Công nghiệp) | Design (UX/UI, Industrial) |
| `health` | Y tế cộng đồng / Y tế | Public Health / Healthcare |
| `other` | Khác / Chưa xác định | Other / Undecided |

**Source files:**
- Backend: `Leaply-BE/src/main/java/ai/leaply/onboarding/enums/TargetField.java`
- Frontend: `Leaply-FE/lib/constants/onboardingMappings.ts` → `FIELD_LABEL_TO_KEY`

---

## Budget Range

User's budget for studying abroad.

| Enum Key | Vietnamese Label | USD Equivalent (Backend) |
|----------|-----------------|--------------------------|
| `under_500m` | <500 triệu | $50,000/year |
| `500m_1b` | 500 triệu - 1 tỷ | $100,000/year |
| `over_1b` | >1 tỷ | $150,000/year |
| `need_full_scholarship` | Cần học bổng full | N/A (matches any) |

**Source files:**
- Backend: `Leaply-BE/src/main/java/ai/leaply/onboarding/enums/BudgetRange.java`
- Backend (USD mapping): `Leaply-BE/src/main/java/ai/leaply/program/service/FitScoreService.java` → `BUDGET_MAP`
- Frontend: `Leaply-FE/lib/constants/onboardingMappings.ts` → `BUDGET_LABEL_TO_KEY`

---

## Degree Types

Program degree types for universities.

| Enum Key | Display Label | Notes |
|----------|--------------|-------|
| `masters` | Master's | Graduate degree |
| `mba` | MBA | Business administration |
| `phd` | PhD | Doctoral degree |

**Note:** `bachelors` exists but is currently disabled in onboarding.

**Source files:**
- Backend: `Leaply-BE/src/main/java/ai/leaply/program/enums/DegreeType.java`
- Admin: Program form dropdowns in `Leaply-Admin/app/(admin)/admin/programs/`
- Frontend: `Leaply-FE/app/onboarding/page.tsx` → `programTypes`

---

## Education Levels

User's current education level.

| Enum Key | Vietnamese Label | English Label |
|----------|-----------------|---------------|
| `high_school` | Học sinh phổ thông | High School |
| `undergrad` | Sinh viên đại học | Undergraduate |
| `graduate` | Sinh viên sau đại học | Graduate |
| `working` | Đang đi làm | Working Professional |

**Source files:**
- Backend: `Leaply-BE/src/main/java/ai/leaply/onboarding/enums/EducationLevel.java`
- Frontend: `Leaply-FE/app/onboarding/page.tsx` → `educationLevels`

---

## Delivery Mode (Programs)

How a program is delivered.

| Enum Key | Display Label |
|----------|--------------|
| `on_campus` | On Campus |
| `online` | Online |
| `hybrid` | Hybrid |

**Important:** Use underscore (`on_campus`), NOT hyphen (`on-campus`).

**Source files:**
- Backend: `Leaply-BE/src/main/java/ai/leaply/program/enums/DeliveryMode.java`
- Admin: Program form dropdowns in `Leaply-Admin/app/(admin)/admin/programs/`

---

## Journey Type

User's study abroad journey type (set during onboarding).

| Enum Key | Description |
|----------|------------|
| `exploring` | Still exploring options, redirects to Persona Lab |
| `has_target` | Has specific target schools, redirects to Explore |

**Source files:**
- Backend: `Leaply-BE/src/main/java/ai/leaply/onboarding/enums/JourneyDirection.java`
- Frontend: `Leaply-FE/lib/store/userStore.ts` → `JourneyType`

---

## Adding New Enum Values

When adding a new enum value:

1. **Backend first**: Add to the Java enum file
2. **Admin**: Update any admin dropdowns that use the enum
3. **Frontend**: Update `onboardingMappings.ts` (both label→key and key→label)
4. **Display formatters**: Update `Leaply-FE/lib/utils/displayFormatters.ts` with the new value
5. **i18n**: Add translations to `Leaply-FE/messages/vi.json` and `en.json`
6. **This doc**: Update this file

**Critical rule:** Always store **enum keys** in the database, never display labels.

---

## Frontend Display Formatters

The frontend has a centralized utility for converting enum keys to human-readable display labels.

**File:** `Leaply-FE/lib/utils/displayFormatters.ts`

### Available Formatters

| Function | Input Example | Output Example |
|----------|--------------|----------------|
| `formatDeliveryMode(mode)` | `"on_campus"` | `"On Campus"` |
| `formatDegreeType(type)` | `"masters"` | `"Master's"` |
| `formatLanguage(lang)` | `"english"` | `"English"` |
| `formatCountryName(country)` | `"united_states"` | `"United States"` |
| `formatRegion(region)` | `"north_america"` | `"North America"` |
| `formatUniversityType(type)` | `"public"` | `"Public"` |
| `formatFitCategory(category)` | `"safety"` | `"Safety"` |
| `formatCurrency(value)` | `45000` | `"$45,000"` |
| `formatTuitionPerYear(value)` | `45000` | `"$45k/yr"` |
| `formatDuration(months)` | `24` | `"2 years"` |
| `formatDate(dateStr)` | `"2026-01-15"` | `"Jan 15, 2026"` |
| `formatIeltsRequirement(score)` | `7.0` | `"IELTS 7.0+"` |
| `formatSnakeCase(value)` | `"any_value"` | `"Any Value"` |

### Usage

```typescript
import { formatDeliveryMode, formatDuration } from "@/lib/utils/displayFormatters";

// In JSX
<p>{formatDeliveryMode(program.deliveryMode)}</p>  // "On Campus"
<p>{formatDuration(program.durationMonths)}</p>     // "2 years"
```

### When to Use Formatters

- **Always** use formatters when displaying enum values from the API
- **Never** display raw enum keys like `on_campus`, `masters`, etc. to users
- Formatters handle `null`/`undefined` values gracefully (return `"N/A"`)

### Used In

- `ProgramCard.tsx` - Program cards in Explore
- `ProgramDetailDrawer.tsx` - Program detail view
- `CompareDrawer.tsx` - Compare programs view
- `ManualMode.tsx` - Table view in Explore
