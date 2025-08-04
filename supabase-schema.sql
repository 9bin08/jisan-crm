-- 운반 월별 데이터 테이블
CREATE TABLE transport_months (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    month_label TEXT NOT NULL UNIQUE,
    company TEXT NOT NULL,
    contact TEXT NOT NULL,
    reg_no TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 운반 행 데이터 테이블
CREATE TABLE transport_rows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    month_id UUID NOT NULL REFERENCES transport_months(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    car_number TEXT NOT NULL,
    company TEXT NOT NULL,
    destination TEXT NOT NULL,
    item TEXT NOT NULL,
    weight TEXT NOT NULL,
    count TEXT NOT NULL,
    unit_price TEXT NOT NULL,
    supply_price TEXT NOT NULL,
    tax TEXT NOT NULL,
    total_price TEXT NOT NULL,
    row_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_transport_months_month_label ON transport_months(month_label);
CREATE INDEX idx_transport_rows_month_id ON transport_rows(month_id);
CREATE INDEX idx_transport_rows_order ON transport_rows(month_id, row_order);

-- RLS (Row Level Security) 활성화
ALTER TABLE transport_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_rows ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기/쓰기 가능하도록 정책 설정 (개발용)
CREATE POLICY "Allow all operations on transport_months" ON transport_months
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on transport_rows" ON transport_rows
    FOR ALL USING (true) WITH CHECK (true);

-- updated_at 자동 업데이트를 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_transport_months_updated_at
    BEFORE UPDATE ON transport_months
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transport_rows_updated_at
    BEFORE UPDATE ON transport_rows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();