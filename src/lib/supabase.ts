import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

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