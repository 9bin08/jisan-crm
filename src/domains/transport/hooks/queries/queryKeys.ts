// 월 관련 쿼리 키
export const monthKeys = {
    all: ['months'] as const,
    lists: () => [...monthKeys.all, 'list'] as const,
    list: (filters: string) => [...monthKeys.lists(), { filters }] as const,
    details: () => [...monthKeys.all, 'detail'] as const,
    detail: (id: string) => [...monthKeys.details(), id] as const,
};

// 운반 데이터 관련 쿼리 키
export const transportKeys = {
    all: ['transport'] as const,
    months: () => [...transportKeys.all, 'months'] as const,
    month: (monthLabel: string | null) => [...transportKeys.months(), monthLabel] as const,
    rows: (monthId: string | null) => [...transportKeys.all, 'rows', monthId] as const,
    multipleMonths: (monthLabels: string[]) => [...transportKeys.months(), 'multiple', monthLabels] as const,
};