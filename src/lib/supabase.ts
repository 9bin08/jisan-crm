import { createClient } from '@supabase/supabase-js';

// 환경 변수 가져오기
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경 변수 검증 강화
if (!supabaseUrl) {
    const error = 'Missing VITE_SUPABASE_URL environment variable. Please check your .env.local file.';
    console.error('❌ Supabase Configuration Error:', error);
    throw new Error(error);
}

if (!supabaseAnonKey) {
    const error = 'Missing VITE_SUPABASE_ANON_KEY environment variable. Please check your .env.local file.';
    console.error('❌ Supabase Configuration Error:', error);
    throw new Error(error);
}

// URL 형식 검증
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    console.warn('⚠️ Supabase URL 형식이 올바르지 않을 수 있습니다:', supabaseUrl);
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    global: {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
});

// 연결 테스트 함수
export async function testSupabaseConnection(): Promise<boolean> {
    try {
        console.log('🔍 Supabase 연결 테스트 시작...');
        console.log('📍 Supabase URL:', supabaseUrl);

        // 간단한 쿼리로 연결 테스트
        const { error } = await supabase
            .from('transport_months')
            .select('id')
            .limit(1);

        if (error) {
            console.error('❌ Supabase 연결 실패:', error.message);
            console.error('상세 에러:', error);
            return false;
        }

        console.log('✅ Supabase 연결 성공!');
        return true;
    } catch (error) {
        console.error('❌ Supabase 연결 테스트 중 예외 발생:', error);
        return false;
    }
}

// 개발 및 프로덕션 환경에서 Supabase 설정 확인
console.log('🔧 Supabase 설정 확인');
console.log('📍 URL:', supabaseUrl ? supabaseUrl : '❌ 없음');
console.log('🔑 Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '❌ 없음');
console.log('🌍 환경:', import.meta.env.MODE);
console.log('📦 빌드 모드:', import.meta.env.PROD ? 'Production' : 'Development');

// 앱 시작 시 연결 테스트 (비동기로 실행하여 앱 시작을 막지 않음)
testSupabaseConnection().catch(err => {
    console.error('Supabase 연결 테스트 실패:', err);
});

// 데이터베이스 타입 정의
export interface Database {
    public: {
        Tables: {
            transport_months: {
                Row: {
                    id: string;
                    month_label: string | null;
                    company: string | null;
                    contact: string | null;
                    reg_no: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    month_label?: string | null;
                    company?: string | null;
                    contact?: string | null;
                    reg_no?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    month_label?: string | null;
                    company?: string | null;
                    contact?: string | null;
                    reg_no?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            transport_rows: {
                Row: {
                    id: string;
                    month_id: string;
                    date: string | null;
                    car_number: string | null;
                    company: string | null;
                    destination: string | null;
                    item: string | null;
                    weight: string | null;
                    count: string | null;
                    unit_price: string | null;
                    supply_price: string | null;
                    tax: string | null;
                    total_price: string | null;
                    row_order: number | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    month_id: string;
                    date?: string | null;
                    car_number?: string | null;
                    company?: string | null;
                    destination?: string | null;
                    item?: string | null;
                    weight?: string | null;
                    count?: string | null;
                    unit_price?: string | null;
                    supply_price?: string | null;
                    tax?: string | null;
                    total_price?: string | null;
                    row_order?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    month_id?: string;
                    date?: string | null;
                    car_number?: string | null;
                    company?: string | null;
                    destination?: string | null;
                    item?: string | null;
                    weight?: string | null;
                    count?: string | null;
                    unit_price?: string | null;
                    supply_price?: string | null;
                    tax?: string | null;
                    total_price?: string | null;
                    row_order?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}