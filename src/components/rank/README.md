# Rank Components

مجموعة من الـ components القابلة لإعادة الاستخدام لشاشة الـ Rank/Competitions.

## المكونات

### 1. RankHeader
الهيدر الرئيسي للصفحة مع الـ logo والنقاط.

```tsx
<RankHeader
  points={1200}
  onMenuPress={() => console.log('Menu')}
/>
```

**Props:**
- `points: number` — عدد النقاط
- `onMenuPress?: () => void` — عند الضغط على القائمة

---

### 2. RankProfileCard
كارت البروفايل مع الـ XP progress bar.

```tsx
<RankProfileCard
  username="Ali:90+"
  level="Elite Player"
  currentXP={2400}
  maxXP={3000}
  avatarUrl="https://..."
/>
```

**Props:**
- `username: string` — اسم المستخدم
- `level: string` — المستوى (Elite Player, Pro, etc.)
- `currentXP: number` — XP الحالي
- `maxXP: number` — XP المطلوب للمستوى التالي
- `avatarUrl: string` — رابط الصورة الشخصية

---

### 3. CompetitionCard
كارت المسابقة الفردية.

```tsx
<CompetitionCard
  title="King of Predictions"
  subtitle="Predict matches and be the best!"
  icon="⚽"
  isLive={true}
  onPress={() => console.log('Pressed')}
/>
```

**Props:**
- `title: string` — عنوان المسابقة
- `subtitle: string` — الوصف
- `icon: string` — الإيموجي
- `isLive?: boolean` — هل المسابقة live (default: true)
- `onPress?: () => void` — عند الضغط

---

### 4. WorldCupCard
كارت الـ World Cup missions.

```tsx
<WorldCupCard
  onViewMissions={() => console.log('View missions')}
/>
```

**Props:**
- `onViewMissions?: () => void` — عند الضغط على "View Missions"

---

### 5. TopPlayerCard
كارت اللاعب في قائمة الـ Top Players.

```tsx
<TopPlayerCard
  name="Mo Salah"
  xp="12,850 XP"
  place={1}
  avatarUrl="https://..."
/>
```

**Props:**
- `name: string` — اسم اللاعب
- `xp: string` — XP مع التنسيق
- `place: number` — الترتيب (1, 2, 3)
- `avatarUrl?: string` — رابط الصورة (default: placeholder)

**ملاحظة:** المركز الأول بيكون أطول من الباقي تلقائياً.

---

### 6. SectionHeader
عنوان القسم مع "View All" اختياري.

```tsx
<SectionHeader
  title="All Competitions"
  showViewAll={true}
  onViewAllPress={() => console.log('View all')}
/>
```

**Props:**
- `title: string` — عنوان القسم
- `showViewAll?: boolean` — إظهار "View All" (default: false)
- `onViewAllPress?: () => void` — عند الضغط على "View All"

---

## الاستخدام

```tsx
import {
  RankHeader,
  RankProfileCard,
  CompetitionCard,
  WorldCupCard,
  TopPlayerCard,
  SectionHeader,
} from '../../components/rank';

// في الـ Screen
<RankHeader points={1200} />
<RankProfileCard username="Ali" level="Elite" currentXP={2400} maxXP={3000} avatarUrl="..." />
<SectionHeader title="Competitions" showViewAll />
<CompetitionCard title="Quiz" subtitle="Daily quiz" icon="❓" />
```

---

## الألوان المستخدمة

| اللون | Hex | الاستخدام |
|---|---|---|
| Primary Purple | `#A855F7` | Buttons, accents, progress |
| Dark Purple | `#7E22CE` | Live button |
| Gold (1st place) | `#3B2A00` → `#151005` | First place gradient |
| Dark Purple Card | `#17112F` → `#0A0818` | Cards gradient |
| Profile Card | `#1A103D` → `#0B081A` | Profile gradient |
| Background | `#05010D` | Screen background |

---

## الملفات

```
src/components/rank/
├── RankHeader.tsx
├── RankProfileCard.tsx
├── CompetitionCard.tsx
├── WorldCupCard.tsx
├── TopPlayerCard.tsx
├── SectionHeader.tsx
├── index.ts
└── README.md
```
