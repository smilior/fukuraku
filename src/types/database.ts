/**
 * 副楽 Supabase データベース型定義
 * テーブル: users / incomes / expenses / receipts
 */

export type Plan = 'free' | 'basic' | 'pro' | 'season'

export type IncomeCategory =
  | 'フリーランス'
  | 'アフィリエイト'
  | '転売・せどり'
  | 'YouTube・動画'
  | '株・投資'
  | '不動産'
  | 'その他'

export type ExpenseCategory =
  | '通信費'
  | '消耗品費'
  | '接待交際費'
  | '交通費'
  | '広告宣伝費'
  | '外注費'
  | '研修費'
  | '地代家賃'
  | 'その他'

export type OcrStatus = 'pending' | 'processing' | 'done' | 'error'

export interface OcrResult {
  date?: string    // 'YYYY-MM-DD'
  amount?: number  // 円単位
  vendor?: string
  category?: ExpenseCategory
  raw_text?: string
}

// ============================================================
// Database 型（Supabase 自動生成型の代替）
// ============================================================
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          plan: Plan
          income_count_year: number
          expense_count_year: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          plan?: Plan
          income_count_year?: number
          expense_count_year?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          plan?: Plan
          income_count_year?: number
          expense_count_year?: number
          updated_at?: string
        }
      }
      incomes: {
        Row: {
          id: string
          user_id: string
          date: string        // 'YYYY-MM-DD'
          amount: number      // 円単位
          source: string
          category: IncomeCategory
          memo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          amount: number
          source: string
          category?: IncomeCategory
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          date?: string
          amount?: number
          source?: string
          category?: IncomeCategory
          memo?: string | null
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          date: string        // 'YYYY-MM-DD'
          amount: number      // 円単位
          category: ExpenseCategory
          description: string
          memo: string | null
          receipt_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          amount: number
          category?: ExpenseCategory
          description: string
          memo?: string | null
          receipt_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          date?: string
          amount?: number
          category?: ExpenseCategory
          description?: string
          memo?: string | null
          receipt_id?: string | null
          updated_at?: string
        }
      }
      receipts: {
        Row: {
          id: string
          user_id: string
          storage_path: string
          ocr_status: OcrStatus
          ocr_result: OcrResult | null
          extracted_date: string | null
          extracted_amount: number | null
          extracted_vendor: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          storage_path: string
          ocr_status?: OcrStatus
          ocr_result?: OcrResult | null
          extracted_date?: string | null
          extracted_amount?: number | null
          extracted_vendor?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          ocr_status?: OcrStatus
          ocr_result?: OcrResult | null
          extracted_date?: string | null
          extracted_amount?: number | null
          extracted_vendor?: string | null
          updated_at?: string
        }
      }
    }
  }
}

// よく使う Row 型のエイリアス
export type UserRow    = Database['public']['Tables']['users']['Row']
export type IncomeRow  = Database['public']['Tables']['incomes']['Row']
export type ExpenseRow = Database['public']['Tables']['expenses']['Row']
export type ReceiptRow = Database['public']['Tables']['receipts']['Row']
