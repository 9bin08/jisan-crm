-- 운반 월별 데이터 테이블
CREATE TABLE transport_months (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    month_label TEXT UNIQUE,
    company TEXT,
    contact TEXT,
    reg_no TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 운반 행 데이터 테이블
CREATE TABLE transport_rows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    row_order INTEGER,
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