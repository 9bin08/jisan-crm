# 🚛 Jisan CRM - 운반내역서 관리 시스템

운반업체를 위한 월별 운반내역서 관리 및 엑셀 처리 시스템입니다.

## ✨ 주요 기능

### 📊 운반내역서 관리
- **월별 데이터 관리**: 월별로 운반내역서 데이터 관리
- **실시간 계산**: 공급가액, 세액, 합계금액 자동 계산
- **자동완성**: 차량번호, 업체, 하차지, 품목 자동완성 기능
- **데이터 검증**: 날짜, 중량, 횟수 등 입력 데이터 검증

### 📈 통계 및 분석
- **실시간 통계**: 총 건수, 공급가액 합계, 세액 합계, 합계금액 표시
- **월별 비교**: 여러 월의 데이터를 통합하여 분석 가능

### 📁 엑셀 처리
- **엑셀 업로드**: 기존 엑셀 파일을 업로드하여 데이터 가져오기
- **엑셀 다운로드**: 현재 월의 운반내역서를 엑셀로 다운로드
- **통합 다운로드**: 여러 월의 데이터를 하나의 엑셀 파일로 통합 다운로드

### 💾 데이터 관리
- **자동 저장**: 데이터 변경 시 자동으로 서버에 저장
- **수동 저장**: 저장 버튼을 통한 수동 저장
- **데이터 동기화**: 서버와 클라이언트 간 실시간 데이터 동기화

## 🛠 기술 스택

### Frontend
- **React 18**: 최신 React 기능 활용
- **TypeScript**: 타입 안전성 보장
- **Material-UI (MUI)**: 모던하고 일관된 UI 컴포넌트
- **TanStack Query**: 서버 상태 관리 및 캐싱
- **Vite**: 빠른 개발 환경 및 빌드 도구

### Backend
- **Supabase**: PostgreSQL 기반 백엔드 서비스
- **PostgREST**: RESTful API 자동 생성
- **Row Level Security (RLS)**: 데이터 보안
- **Real-time**: 실시간 데이터 동기화

### 기타
- **xlsx-js-style**: 엑셀 파일 처리 및 스타일링
- **React Hook Form**: 폼 상태 관리
- **Zod**: 스키마 검증

## 📁 프로젝트 구조

```
src/
├── components/                 # 공통 컴포넌트
│   ├── ErrorBoundary.tsx      # 에러 경계 처리
│   └── SuspenseFallback.tsx   # 로딩 상태 처리
├── lib/                       # 라이브러리 설정
│   ├── queryClient.ts         # TanStack Query 설정
│   └── supabase.ts           # Supabase 클라이언트
└── domains/
    └── transport/             # 운반 도메인
        ├── components/        # 도메인별 컴포넌트
        │   ├── table/         # 테이블 관련 컴포넌트
        │   ├── Sidebar.tsx    # 사이드바
        │   ├── Header.tsx     # 헤더
        │   └── ...
        ├── constants/         # 상수 정의
        │   ├── tableConstants.ts
        │   ├── uiConstants.ts
        │   └── messageConstants.ts
        ├── hooks/             # 커스텀 훅
        │   ├── queries/       # TanStack Query 훅
        │   ├── useMonthManagement.ts
        │   ├── useTransportData.ts
        │   └── ...
        ├── services/          # API 서비스
        │   └── transportService.ts
        ├── styles/            # 스타일 정의
        │   └── tableStyles.ts
        ├── types/             # 타입 정의
        │   └── index.ts
        ├── utils/             # 유틸리티 함수
        │   ├── calculations.ts
        │   ├── excel.ts
        │   └── logger.ts
        └── index.tsx          # 메인 컴포넌트
```

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone git@github.com:9bin08/jisan-crm.git
cd jisan-crm
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 Supabase 설정을 추가하세요:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 브라우저에서 확인
```
http://localhost:5173
```

## 📋 데이터베이스 스키마

### transport_months 테이블
```sql
CREATE TABLE transport_months (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month_label TEXT NOT NULL UNIQUE,
    company TEXT,
    contact TEXT,
    reg_no TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### transport_rows 테이블
```sql
CREATE TABLE transport_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month_id UUID REFERENCES transport_months(id) ON DELETE CASCADE,
    date TEXT,
    car_number TEXT,
    company TEXT,
    destination TEXT,
    item TEXT,
    weight TEXT,
    count TEXT,
    unit_price TEXT,
    supply_price TEXT,
    tax TEXT,
    total_price TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 주요 기능 상세

### 월별 관리
- **월 추가**: 자동으로 다음 월 생성
- **월 삭제**: 선택한 월과 관련 데이터 삭제
- **월 선택**: 탭을 통한 월별 데이터 전환

### 데이터 입력
- **날짜**: 월/일 형식으로 입력 (1-31일 제한)
- **차량번호**: 자동완성 지원
- **업체/상차지**: 자동완성 지원
- **하차지**: 자동완성 지원
- **품목**: 자동완성 지원
- **중량**: 소수점 3자리까지 입력 가능
- **횟수**: 정수만 입력 가능
- **단가**: 한국 통화 형식으로 표시
- **공급가액**: 중량 × 단가 자동 계산
- **세액**: 공급가액 × 10% 자동 계산
- **합계금액**: 공급가액 + 세액 자동 계산

### 엑셀 처리
- **업로드**: .xlsx, .xls, .csv 파일 지원
- **다운로드**: 스타일이 적용된 엑셀 파일 생성
- **통합 다운로드**: 여러 월의 데이터를 하나의 파일로 통합

## 🔧 개발 가이드

### 코드 스타일
- **TypeScript**: 엄격한 타입 체크 사용
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅

### 아키텍처 패턴
- **Domain-Driven Design**: 도메인별 폴더 구조
- **Component Composition**: 컴포넌트 합성 패턴
- **Custom Hooks**: 비즈니스 로직 분리
- **TanStack Query**: 서버 상태 관리

### 성능 최적화
- **React.memo**: 불필요한 리렌더링 방지
- **useMemo/useCallback**: 메모이제이션 활용
- **Code Splitting**: 동적 import 활용
- **Caching**: TanStack Query 캐싱 전략

## 🐛 문제 해결

### 일반적인 문제
1. **환경 변수 오류**: `.env.local` 파일이 올바르게 설정되었는지 확인
2. **Supabase 연결 오류**: URL과 API 키가 정확한지 확인
3. **포트 충돌**: 다른 포트를 사용하도록 설정

### 개발 도구
- **React Developer Tools**: 컴포넌트 디버깅
- **TanStack Query DevTools**: 쿼리 상태 모니터링
- **Supabase Dashboard**: 데이터베이스 관리

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

프로젝트 관리자: [9bin08](https://github.com/9bin08)

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
