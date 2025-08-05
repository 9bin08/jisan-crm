# Frontend Design Guideline

이 문서는 프론트엔드 개발 시 따라야 할 핵심 디자인 원칙과 규칙을 정리합니다.
모든 프론트엔드 코드 작성 시 이 가이드라인을 준수해주세요.

## 📋 목차

1. [Readability (가독성)](#readability)
2. [Predictability (예측 가능성)](#predictability)
3. [Cohesion (응집도)](#cohesion)
4. [Coupling (결합도)](#coupling)
5. [Performance (성능)](#performance)
6. [Accessibility (접근성)](#accessibility)
7. [Type Safety (타입 안전성)](#type-safety)

---

## Readability

코드의 명확성과 이해하기 쉬움을 개선합니다.

### Naming Magic Numbers

**규칙:** 매직 넘버를 의미 있는 상수로 대체하세요.

**이유:**
- 의미 없는 값에 의미를 부여하여 명확성을 향상시킵니다.
- 유지보수성을 개선합니다.

#### 권장 패턴:

```typescript
const ANIMATION_DELAY_MS = 300;
const MAX_RETRY_ATTEMPTS = 3;
const AUTO_SAVE_DELAY = 5000;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS); // 애니메이션 대기 시간임을 명확히 표시
  await refetchPostLike();
}
```

### Abstracting Implementation Details

**규칙:** 복잡한 로직/상호작용을 전용 컴포넌트/HOC로 추상화하세요.

**이유:**
- 관심사 분리를 통해 인지 부하를 줄입니다.
- 컴포넌트의 가독성, 테스트 가능성, 유지보수성을 개선합니다.

#### 권장 패턴 1: Auth Guard

```tsx
// App 구조
function App() {
  return (
    <AuthGuard>
      {/* 래퍼가 인증 체크를 처리 */}
      <LoginStartPage />
    </AuthGuard>
  );
}

// AuthGuard 컴포넌트가 체크/리다이렉트 로직을 캡슐화
function AuthGuard({ children }) {
  const status = useCheckLoginStatus();
  useEffect(() => {
    if (status === "LOGGED_IN") {
      location.href = "/home";
    }
  }, [status]);

  // 로그인하지 않은 경우에만 children을 렌더링
  return status !== "LOGGED_IN" ? children : null;
}

// LoginStartPage는 이제 더 간단해지고 로그인 UI/로직에만 집중
function LoginStartPage() {
  // ... 로그인 관련 로직만 ...
  return <>{/* ... 로그인 관련 컴포넌트들 ... */}</>;
}
```

#### 권장 패턴 2: 전용 상호작용 컴포넌트

```tsx
export function FriendInvitation() {
  const { data } = useQuery(/* ... */);

  return (
    <>
      {/* 전용 버튼 컴포넌트 사용 */}
      <InviteButton name={data.name} />
      {/* ... 다른 UI ... */}
    </>
  );
}

// InviteButton이 확인 플로우를 내부적으로 처리
function InviteButton({ name }) {
  const handleClick = async () => {
    const canInvite = await overlay.openAsync(({ isOpen, close }) => (
      <ConfirmDialog
        title={`${name}와 공유하기`}
        // ... 다이얼로그 설정 ...
      />
    ));

    if (canInvite) {
      await sendPush();
    }
  };

  return <Button onClick={handleClick}>초대하기</Button>;
}
```

### Separating Code Paths for Conditional Rendering

**규칙:** 크게 다른 조건부 UI/로직을 별도의 컴포넌트로 분리하세요.

**이유:**
- 하나의 컴포넌트 내에서 복잡한 조건문을 피하여 가독성을 개선합니다.
- 각 전문화된 컴포넌트가 명확한 단일 책임을 가지도록 보장합니다.

#### 권장 패턴:

```tsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";

  // 렌더링을 전문화된 컴포넌트에 위임
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

// 'viewer' 역할 전용 컴포넌트
function ViewerSubmitButton() {
  return <TextButton disabled>제출</TextButton>;
}

// 'admin' (또는 non-viewer) 역할 전용 컴포넌트
function AdminSubmitButton() {
  useEffect(() => {
    showAnimation(); // 애니메이션 로직을 여기서 격리
  }, []);

  return <Button type="submit">제출</Button>;
}
```

### Simplifying Complex Ternary Operators

**규칙:** 복잡한/중첩된 삼항 연산자를 `if`/`else` 또는 IIFE로 대체하세요.

**이유:**
- 조건부 로직을 빠르게 따라가기 쉽게 만듭니다.
- 전체적인 코드 유지보수성을 개선합니다.

#### 권장 패턴:

```typescript
const status = (() => {
  if (ACondition && BCondition) return "BOTH";
  if (ACondition) return "A";
  if (BCondition) return "B";
  return "NONE";
})();
```

### Reducing Eye Movement (Colocating Simple Logic)

**규칙:** 간단한, 지역화된 로직을 함께 배치하거나 인라인 정의를 사용하여 컨텍스트 전환을 줄이세요.

**이유:**
- 위에서 아래로 읽기와 빠른 이해를 가능하게 합니다.
- 컨텍스트 전환(눈의 움직임)으로 인한 인지 부하를 줄입니다.

#### 권장 패턴 A: 인라인 `switch`

```tsx
function Page() {
  const user = useUser();

  // 로직이 여기서 직접 보임
  switch (user.role) {
    case "admin":
      return (
        <div>
          <Button disabled={false}>초대</Button>
          <Button disabled={false}>보기</Button>
        </div>
      );
    case "viewer":
      return (
        <div>
          <Button disabled={true}>초대</Button> {/* viewer용 예시 */}
          <Button disabled={false}>보기</Button>
        </div>
      );
    default:
      return null;
  }
}
```

#### 권장 패턴 B: 함께 배치된 간단한 정책 객체

```tsx
function Page() {
  const user = useUser();
  // 간단한 정책이 여기서 정의됨, 쉽게 볼 수 있음
  const policy = {
    admin: { canInvite: true, canView: true },
    viewer: { canInvite: false, canView: true },
  }[user.role];

  // 역할이 일치하지 않을 수 있으므로 속성에 접근하기 전에 정책이 존재하는지 확인
  if (!policy) return null;

  return (
    <div>
      <Button disabled={!policy.canInvite}>초대</Button>
      <Button disabled={!policy.canView}>보기</Button>
    </div>
  );
}
```

### Naming Complex Conditions

**규칙:** 복잡한 불린 조건을 명명된 변수에 할당하세요.

**이유:**
- 조건의 _의미_를 명시적으로 만듭니다.
- 인지 부하를 줄여 가독성과 자체 문서화를 개선합니다.

#### 권장 패턴:

```typescript
const matchedProducts = products.filter((product) => {
  // 제품이 대상 카테고리에 속하는지 확인
  const isSameCategory = product.categories.some(
    (category) => category.id === targetCategory.id
  );

  // 제품 가격이 원하는 범위 내에 있는지 확인
  const isPriceInRange = product.prices.some(
    (price) => price >= minPrice && price <= maxPrice
  );

  // 전체 조건이 이제 훨씬 명확해짐
  return isSameCategory && isPriceInRange;
});
```

**가이드라인:** 로직이 복잡하거나, 재사용되거나, 단위 테스트가 필요한 경우 조건에 이름을 붙이세요. 매우 간단하고 한 번만 사용되는 조건에는 이름을 붙이지 마세요.

---

## Predictability

코드가 이름, 매개변수, 컨텍스트에 따라 예상대로 동작하도록 보장합니다.

### Standardizing Return Types

**규칙:** 유사한 함수/훅에 대해 일관된 반환 타입을 사용하세요.

**이유:**
- 개발자가 반환 값 형태를 예상할 수 있어 코드 예측 가능성을 개선합니다.
- 일관되지 않은 타입으로 인한 혼란과 잠재적 오류를 줄입니다.

#### 권장 패턴 1: API 훅 (React Query)

```typescript
// 항상 Query 객체를 반환
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// fetchUser가 Promise<UserType>을 반환한다고 가정
function useUser(): UseQueryResult<UserType, Error> {
  const query = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  return query;
}

// fetchServerTime이 Promise<Date>를 반환한다고 가정
function useServerTime(): UseQueryResult<Date, Error> {
  const query = useQuery({
    queryKey: ["serverTime"],
    queryFn: fetchServerTime,
  });
  return query;
}
```

#### 권장 패턴 2: 검증 함수

```typescript
type ValidationResult = { ok: true } | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationResult {
  if (name.length === 0) return { ok: false, reason: "이름은 비워둘 수 없습니다." };
  if (name.length >= 20)
    return { ok: false, reason: "이름은 20자를 초과할 수 없습니다." };
  return { ok: true };
}

function checkIsAgeValid(age: number): ValidationResult {
  if (!Number.isInteger(age))
    return { ok: false, reason: "나이는 정수여야 합니다." };
  if (age < 18) return { ok: false, reason: "나이는 18세 이상이어야 합니다." };
  if (age > 99) return { ok: false, reason: "나이는 99세 이하여야 합니다." };
  return { ok: true };
}

// 사용법: ok가 false일 때만 'reason'에 안전하게 접근 가능
const nameValidation = checkIsNameValid(name);
if (!nameValidation.ok) {
  console.error(nameValidation.reason);
}
```

### Revealing Hidden Logic (Single Responsibility)

**규칙:** 숨겨진 부작용을 피하세요; 함수는 시그니처에서 암시되는 작업만 수행해야 합니다 (SRP).

**이유:**
- 의도하지 않은 부작용 없이 예측 가능한 동작으로 이어집니다.
- 관심사 분리(SRP)를 통해 더 견고하고 테스트 가능한 코드를 만듭니다.

#### 권장 패턴:

```typescript
// 함수는 *오직* 잔액을 가져옴
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");
  return balance;
}

// 호출자가 필요한 곳에서 명시적으로 로깅 수행
async function handleUpdateClick() {
  const balance = await fetchBalance(); // 가져오기
  logging.log("balance_fetched"); // 로깅 (명시적 작업)
  await syncBalance(balance); // 다른 작업
}
```

### Using Unique and Descriptive Names (Avoiding Ambiguity)

**규칙:** 모호함을 피하기 위해 커스텀 래퍼/함수에 고유하고 설명적인 이름을 사용하세요.

**이유:**
- 모호함을 피하고 예측 가능성을 향상시킵니다.
- 개발자가 이름에서 직접 특정 작업(예: 인증 추가)을 이해할 수 있게 합니다.

#### 권장 패턴:

```typescript
// httpService.ts에서 - 더 명확한 모듈 이름
import { http as httpLibrary } from "@some-library/http";

export const httpService = {
  // 고유한 모듈 이름
  async getWithAuth(url: string) {
    // 설명적인 함수 이름
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// fetchUser.ts에서 - 사용법이 인증을 명확히 표시
import { httpService } from "./httpService";
export async function fetchUser() {
  // 'getWithAuth' 이름이 동작을 명시적으로 만듦
  return await httpService.getWithAuth("...");
}
```

---

## Cohesion

관련 코드를 함께 유지하고 모듈이 잘 정의된 단일 목적을 가지도록 보장합니다.

### Considering Form Cohesion

**규칙:** 폼 요구사항에 따라 필드 수준 또는 폼 수준 응집도를 선택하세요.

**이유:**
- 필드 독립성(필드 수준)과 폼 통합성(폼 수준) 사이의 균형을 맞춥니다.
- 관련 폼 로직이 요구사항에 따라 적절히 그룹화되도록 보장합니다.

#### 권장 패턴 (필드 수준 예시):

```tsx
// 각 필드가 자체 `validate` 함수를 사용
import { useForm } from "react-hook-form";

export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    /* defaultValues 등 */
  });

  const onSubmit = handleSubmit((formData) => {
    console.log("폼 제출됨:", formData);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          {...register("name", {
            validate: (value) =>
              value.trim() === "" ? "이름을 입력해주세요." : true, // 예시 검증
          })}
          placeholder="이름"
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <input
          {...register("email", {
            validate: (value) =>
              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                ? true
                : "유효하지 않은 이메일 주소입니다.", // 예시 검증
          })}
          placeholder="이메일"
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <button type="submit">제출</button>
    </form>
  );
}
```

#### 권장 패턴 (폼 수준 예시):

```tsx
// 단일 스키마가 전체 폼의 검증을 정의
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().min(1, "이메일을 입력해주세요.").email("유효하지 않은 이메일입니다."),
});

export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = handleSubmit((formData) => {
    console.log("폼 제출됨:", formData);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input {...register("name")} placeholder="이름" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <input {...register("email")} placeholder="이메일" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <button type="submit">제출</button>
    </form>
  );
}
```

**가이드라인:** 독립적인 검증, 비동기 체크, 또는 재사용 가능한 필드의 경우 **필드 수준**을 선택하세요. 관련 필드, 위저드 폼, 또는 상호 의존적인 검증의 경우 **폼 수준**을 선택하세요.

### Organizing Code by Feature/Domain

**규칙:** 코드 타입뿐만 아니라 기능/도메인별로 디렉토리를 구성하세요.

**이유:**
- 관련 파일을 함께 유지하여 응집도를 증가시킵니다.
- 기능 이해, 개발, 유지보수, 삭제를 단순화합니다.

#### 권장 패턴:

```
src/
├── components/ # 공유/공통 컴포넌트
├── hooks/      # 공유/공통 훅
├── utils/      # 공유/공통 유틸리티
├── domains/
│   ├── user/
│   │   ├── components/
│   │   │   └── UserProfileCard.tsx
│   │   ├── hooks/
│   │   │   └── useUser.ts
│   │   └── index.ts # 선택적 배럴 파일
│   ├── product/
│   │   ├── components/
│   │   │   └── ProductList.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   └── ...
│   └── order/
│       ├── components/
│       │   └── OrderSummary.tsx
│       ├── hooks/
│       │   └── useOrder.ts
│       └── ...
└── App.tsx
```

### Relating Magic Numbers to Logic

**규칙:** 상수를 관련 로직 근처에 정의하거나 이름이 명확하게 연결되도록 보장하세요.

**이유:**
- 상수를 대표하는 로직과 연결하여 응집도를 개선합니다.
- 로직을 업데이트할 때 관련 상수를 업데이트하지 않아서 발생하는 조용한 실패를 방지합니다.

#### 권장 패턴:

```typescript
// 상수가 명확하게 명명되고 잠재적으로 애니메이션 로직 근처에 정의됨
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  // 지연이 상수를 사용하여 애니메이션과의 연결을 유지
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

_상수가 의존하는 로직과 함께 유지되거나 관계를 보여주기 위해 명확하게 명명되도록 보장하세요._

---

## Coupling

코드베이스의 서로 다른 부분 간의 의존성을 최소화합니다.

### Balancing Abstraction and Coupling (Avoiding Premature Abstraction)

**규칙:** 사용 사례가 분기될 수 있다면 중복의 조기 추상화를 피하세요; 낮은 결합도를 선호하세요.

**이유:**
- 잠재적으로 분기되는 로직을 하나의 추상화로 강제하는 것에서 오는 긴밀한 결합을 피합니다.
- 미래의 요구사항이 불확실할 때 일부 중복을 허용하면 결합 해제와 유지보수성을 개선할 수 있습니다.

#### 가이드라인:

추상화하기 전에 로직이 정말 동일하고 모든 사용 사례에서 _동일하게 유지될_ 가능성이 높은지 고려하세요. 분기가 가능하다면(예: 다른 페이지가 `useOpenMaintenanceBottomSheet`와 같은 공유 훅에서 약간 다른 동작을 필요로 하는 경우), 초기에 로직을 분리하여 유지하는 것(중복 허용)이 더 유지보수 가능하고 결합이 낮은 코드로 이어질 수 있습니다. 팀과 함께 트레이드오프를 논의하세요.

### Scoping State Management (Avoiding Overly Broad Hooks)

**규칙:** 광범위한 상태 관리를 더 작고 집중된 훅/컨텍스트로 분해하세요.

**이유:**
- 컴포넌트가 필요한 상태 조각에만 의존하도록 보장하여 결합을 줄입니다.
- 관련 없는 상태 변경으로 인한 불필요한 리렌더링을 방지하여 성능을 개선합니다.

#### 권장 패턴:

```typescript
// cardId 쿼리 파라미터 전용 훅
import { useQueryParam, NumberParam } from "use-query-params";
import { useCallback } from "react";

export function useCardIdQueryParam() {
  // 'query'가 원시 파라미터 값을 제공한다고 가정
  const [cardIdParam, setCardIdParam] = useQueryParam("cardId", NumberParam);

  const setCardId = useCallback(
    (newCardId: number | undefined) => {
      setCardIdParam(newCardId, "replaceIn"); // 또는 원하는 히스토리 동작에 따라 'push'
    },
    [setCardIdParam]
  );

  // 안정적인 반환 튜플 제공
  return [cardIdParam ?? undefined, setCardId] as const;
}

// 날짜 범위 등에 대한 별도 훅
// export function useDateRangeQueryParam() { /* ... */ }
```

이제 컴포넌트는 `cardId`가 필요한 경우에만 `useCardIdQueryParam`을 가져와서 사용하므로 날짜 범위 상태 등과 결합이 해제됩니다.

### Eliminating Props Drilling with Composition

**규칙:** Props Drilling 대신 컴포넌트 컴포지션을 사용하세요.

**이유:**
- 불필요한 중간 의존성을 제거하여 결합을 크게 줄입니다.
- 더 평평한 컴포넌트 트리에서 리팩토링을 쉽게 만들고 데이터 흐름을 명확히 합니다.

#### 권장 패턴:

```tsx
import React, { useState } from "react";

// Modal, Input, Button, ItemEditList 컴포넌트가 존재한다고 가정

function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  // Modal 내에서 children을 직접 렌더링, 필요한 곳에만 props 전달
  return (
    <Modal open={open} onClose={onClose}>
      {/* Input과 Button을 직접 렌더링 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)} // 여기서 상태 관리
          placeholder="항목 검색..."
        />
        <Button onClick={onClose}>닫기</Button>
      </div>
      {/* ItemEditList를 직접 렌더링, 필요한 props를 받음 */}
      <ItemEditList
        keyword={keyword} // 직접 전달
        items={items} // 직접 전달
        recommendedItems={recommendedItems} // 직접 전달
        onConfirm={onConfirm} // 직접 전달
      />
    </Modal>
  );
}

// 중간 ItemEditBody 컴포넌트가 제거되어 결합이 줄어듦
```

---

## Performance

애플리케이션의 성능을 최적화합니다.

### React.memo 사용

**규칙:** 불필요한 리렌더링을 방지하기 위해 React.memo를 적절히 사용하세요.

**이유:**
- props가 변경되지 않았을 때 컴포넌트 리렌더링을 방지합니다.
- 성능을 크게 향상시킬 수 있습니다.

#### 권장 패턴:

```tsx
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  showCurrency?: boolean;
}

const StatCard = React.memo<StatCardProps>(({
  title,
  value,
  icon,
  showCurrency = false
}) => {
  const displayValue = React.useMemo(() => {
    if (showCurrency) {
      return `₩${value.toLocaleString('ko-KR')}`;
    }
    return value;
  }, [value, showCurrency]);

  return (
    <Card>
      <Typography>{title}</Typography>
      <Typography>{displayValue}</Typography>
    </Card>
  );
});

StatCard.displayName = 'StatCard';
```

### useMemo와 useCallback 최적화

**규칙:** 계산 비용이 큰 연산과 함수 참조를 메모이제이션하세요.

**이유:**
- 불필요한 재계산을 방지합니다.
- 자식 컴포넌트의 불필요한 리렌더링을 방지합니다.

#### 권장 패턴:

```tsx
function TransportTable({ rows, onChange }) {
  // 계산 비용이 큰 옵션 추출을 메모이제이션
  const options = useMemo(() => {
    return {
      companies: extractUniqueValues(rows, 'company'),
      destinations: extractUniqueValues(rows, 'destination'),
      items: extractUniqueValues(rows, 'item'),
    };
  }, [rows]);

  // 함수 참조를 안정화
  const handleCalculate = useCallback((idx: number, type: string) => {
    // 계산 로직
  }, [rows, onChange]);

  return (
    <Table>
      {rows.map((row, idx) => (
        <TableRow
          key={idx}
          row={row}
          options={options}
          onCalculate={handleCalculate}
        />
      ))}
    </Table>
  );
}
```

### 코드 분할 (Code Splitting)

**규칙:** 큰 번들을 작은 청크로 분할하여 초기 로딩 시간을 단축하세요.

**이유:**
- 사용자가 필요한 코드만 다운로드합니다.
- 초기 페이지 로드 시간을 크게 단축할 수 있습니다.

#### 권장 패턴:

```tsx
// 동적 import를 사용한 지연 로딩
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

---

## Accessibility

모든 사용자가 애플리케이션에 접근할 수 있도록 보장합니다.

### ARIA 라벨과 역할

**규칙:** 스크린 리더 사용자를 위해 적절한 ARIA 라벨과 역할을 제공하세요.

**이유:**
- 시각 장애가 있는 사용자가 애플리케이션을 사용할 수 있게 합니다.
- 웹 접근성 표준을 준수합니다.

#### 권장 패턴:

```tsx
function ActionButtons({ onSave, onDelete }) {
  return (
    <Stack role="toolbar" aria-label="데이터 관리 도구">
      <Button
        onClick={onSave}
        aria-label="데이터 저장"
        startIcon={<SaveIcon />}
      >
        저장
      </Button>
      <Button
        onClick={onDelete}
        aria-label="데이터 삭제"
        startIcon={<DeleteIcon />}
        color="error"
      >
        삭제
      </Button>
    </Stack>
  );
}
```

### 키보드 네비게이션

**규칙:** 모든 상호작용이 키보드로 가능하도록 보장하세요.

**이유:**
- 키보드만 사용하는 사용자를 지원합니다.
- 모바일 장치에서도 접근성을 향상시킵니다.

#### 권장 패턴:

```tsx
function InteractiveButton({ onClick, children }) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      sx={{
        '&:focus-visible': {
          outline: `2px solid ${COLORS.PRIMARY}`,
          outlineOffset: '2px',
        },
      }}
    >
      {children}
    </Button>
  );
}
```

### 색상 대비

**규칙:** WCAG 가이드라인에 따라 충분한 색상 대비를 제공하세요.

**이유:**
- 색맹이나 시력이 낮은 사용자를 지원합니다.
- 다양한 조명 조건에서 가독성을 보장합니다.

#### 권장 패턴:

```tsx
// 상수로 색상 정의
export const COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  GRAY: {
    50: '#f9fafb',
    500: '#6b7280',
    800: '#1f2937',
  },
} as const;

// 충분한 대비를 가진 색상 조합 사용
<Typography color={COLORS.GRAY[800]}>
  어두운 배경에 밝은 텍스트
</Typography>
```

---

## Type Safety

TypeScript를 효과적으로 활용하여 타입 안전성을 보장합니다.

### any 타입 제거

**규칙:** any 타입을 사용하지 말고 구체적인 타입을 정의하세요.

**이유:**
- 런타임 오류를 컴파일 타임에 잡을 수 있습니다.
- IDE 자동완성과 리팩토링을 개선합니다.

#### 권장 패턴:

```typescript
// 나쁜 예
function handleError(error: any) {
  console.error(error.message);
}

// 좋은 예
interface ErrorWithMessage {
  message: string;
  [key: string]: unknown;
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

function handleError(error: unknown) {
  if (isErrorWithMessage(error)) {
    console.error(error.message);
  } else {
    console.error('알 수 없는 오류가 발생했습니다.');
  }
}
```

### 타입 가드 활용

**규칙:** 런타임 타입 검증을 위해 타입 가드를 사용하세요.

**이유:**
- 타입 안전성을 보장하면서 런타임 검증을 수행합니다.
- 복잡한 타입 체크를 재사용 가능하게 만듭니다.

#### 권장 패턴:

```typescript
// 네트워크 에러 타입 가드
const isNetworkError = (error: unknown): error is Error => {
  return error instanceof Error && (
    error.message.includes('fetch') ||
    error.message.includes('timeout') ||
    error.message.includes('network')
  );
};

// 사용 예시
function handleNetworkError(error: unknown) {
  if (isNetworkError(error)) {
    // 여기서 error는 Error 타입으로 좁혀짐
    console.error('네트워크 오류:', error.message);
  }
}
```

### 제네릭 활용

**규칙:** 재사용 가능한 컴포넌트와 함수를 위해 제네릭을 활용하세요.

**이유:**
- 타입 안전성을 유지하면서 코드 재사용성을 높입니다.
- 컴파일 타임에 타입 오류를 잡을 수 있습니다.

#### 권장 패턴:

```typescript
// 제네릭 훅
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// 사용 예시
const [user, setUser] = useLocalStorage<User | null>('user', null);
```

---

## 📝 결론

이 가이드라인을 따르면 다음과 같은 이점을 얻을 수 있습니다:

1. **가독성**: 코드가 이해하기 쉽고 유지보수하기 쉬워집니다.
2. **예측 가능성**: 코드가 예상대로 동작합니다.
3. **응집도**: 관련 코드가 함께 유지됩니다.
4. **결합도**: 불필요한 의존성이 줄어듭니다.
5. **성능**: 최적화된 렌더링과 번들 크기.
6. **접근성**: 모든 사용자가 애플리케이션을 사용할 수 있습니다.
7. **타입 안전성**: 런타임 오류를 컴파일 타임에 방지합니다.

팀원들과 함께 이 가이드라인을 검토하고 프로젝트에 맞게 조정하세요. 지속적으로 개선하고 새로운 패턴을 추가하여 팀의 개발 경험을 향상시키세요.

---

## 🔗 참고 자료

- [React 공식 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Material-UI 가이드라인](https://mui.com/material-ui/getting-started/)
- [WCAG 접근성 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Query 문서](https://tanstack.com/query/latest)