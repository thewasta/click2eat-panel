export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business: {
        Row: {
          address: string
          business_id: string
          country: string
          created_at: string
          document_number: string
          document_type: string
          is_active: boolean | null
          name: string
          postal_code: string
          province: string
          town: string
        }
        Insert: {
          address: string
          business_id?: string
          country: string
          created_at?: string
          document_number: string
          document_type: string
          is_active?: boolean | null
          name: string
          postal_code: string
          province: string
          town: string
        }
        Update: {
          address?: string
          business_id?: string
          country?: string
          created_at?: string
          document_number?: string
          document_type?: string
          is_active?: boolean | null
          name?: string
          postal_code?: string
          province?: string
          town?: string
        }
        Relationships: []
      }
      business_dinning_table_location: {
        Row: {
          business_local: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          business_local: string
          created_at?: string
          description: string
          id?: string
          is_active: boolean
          name: string
        }
        Update: {
          business_local?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_dinning_table_location_business_local_fkey"
            columns: ["business_local"]
            isOneToOne: false
            referencedRelation: "business_local"
            referencedColumns: ["business_local_id"]
          },
        ]
      }
      business_local: {
        Row: {
          address: string
          business_id: string
          business_local_id: string
          country: string
          created_at: string
          gmt: string | null
          latitude: number | null
          longitude: number | null
          postal_code: string
          province: string
          time_zone: string | null
          town: string
        }
        Insert: {
          address: string
          business_id?: string
          business_local_id?: string
          country: string
          created_at?: string
          gmt?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code: string
          province: string
          time_zone?: string | null
          town: string
        }
        Update: {
          address?: string
          business_id?: string
          business_local_id?: string
          country?: string
          created_at?: string
          gmt?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string
          province?: string
          time_zone?: string | null
          town?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_local_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["business_id"]
          },
        ]
      }
      business_local_user_pivot: {
        Row: {
          business_local_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          business_local_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          business_local_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_local_user_pivot_business_local_id_fkey"
            columns: ["business_local_id"]
            isOneToOne: false
            referencedRelation: "business_local"
            referencedColumns: ["business_local_id"]
          },
          {
            foreignKeyName: "business_local_user_pivot_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      business_user_pivot: {
        Row: {
          business_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_user_pivot_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_user_pivot_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "business_user_pivot_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      category: {
        Row: {
          business_local: string
          category_id: string
          created_at: string
          description: string
          images: string | null
          name: string
          offer: number | null
          status: Database["public"]["Enums"]["product_status"]
        }
        Insert: {
          business_local: string
          category_id?: string
          created_at?: string
          description: string
          images?: string | null
          name: string
          offer?: number | null
          status: Database["public"]["Enums"]["product_status"]
        }
        Update: {
          business_local?: string
          category_id?: string
          created_at?: string
          description?: string
          images?: string | null
          name?: string
          offer?: number | null
          status?: Database["public"]["Enums"]["product_status"]
        }
        Relationships: [
          {
            foreignKeyName: "category_business_local_fkey"
            columns: ["business_local"]
            isOneToOne: false
            referencedRelation: "business_local"
            referencedColumns: ["business_local_id"]
          },
        ]
      }
      dinning_table: {
        Row: {
          business_local: string
          created_at: string
          description: string | null
          dinning_table_id: string
          is_active: boolean
          max_pax: number
          name: string
          status: Database["public"]["Enums"]["dinning_table_status"]
          table_location: string
        }
        Insert: {
          business_local: string
          created_at?: string
          description?: string | null
          dinning_table_id?: string
          is_active?: boolean
          max_pax: number
          name: string
          status: Database["public"]["Enums"]["dinning_table_status"]
          table_location: string
        }
        Update: {
          business_local?: string
          created_at?: string
          description?: string | null
          dinning_table_id?: string
          is_active?: boolean
          max_pax?: number
          name?: string
          status?: Database["public"]["Enums"]["dinning_table_status"]
          table_location?: string
        }
        Relationships: [
          {
            foreignKeyName: "dinning_table_business_local_fkey"
            columns: ["business_local"]
            isOneToOne: false
            referencedRelation: "business_local"
            referencedColumns: ["business_local_id"]
          },
          {
            foreignKeyName: "dinning_table_table_location_fkey"
            columns: ["table_location"]
            isOneToOne: false
            referencedRelation: "business_dinning_table_location"
            referencedColumns: ["id"]
          },
        ]
      }
      order: {
        Row: {
          business_local: string
          client_comments: string | null
          created_at: string
          dinning_table: string
          order_id: number
          status: Database["public"]["Enums"]["order_status"]
          user_comment: string | null
        }
        Insert: {
          business_local: string
          client_comments?: string | null
          created_at?: string
          dinning_table: string
          order_id?: number
          status: Database["public"]["Enums"]["order_status"]
          user_comment?: string | null
        }
        Update: {
          business_local?: string
          client_comments?: string | null
          created_at?: string
          dinning_table?: string
          order_id?: number
          status?: Database["public"]["Enums"]["order_status"]
          user_comment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_business_local_fkey"
            columns: ["business_local"]
            isOneToOne: false
            referencedRelation: "business_local"
            referencedColumns: ["business_local_id"]
          },
          {
            foreignKeyName: "order_dinning_table_fkey"
            columns: ["dinning_table"]
            isOneToOne: false
            referencedRelation: "dinning_table"
            referencedColumns: ["dinning_table_id"]
          },
        ]
      }
      product: {
        Row: {
          active: boolean
          business_local: string
          category: string
          created_at: string
          description: string
          highlight: boolean
          images: string[]
          name: string
          offer_price: number | null
          price: number
          product_id: string
          publish_date: string | null
          status: Database["public"]["Enums"]["product_status"]
          sub_category: string | null
        }
        Insert: {
          active?: boolean
          business_local?: string
          category: string
          created_at?: string
          description: string
          highlight?: boolean
          images: string[]
          name: string
          offer_price?: number | null
          price: number
          product_id?: string
          publish_date?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          sub_category?: string | null
        }
        Update: {
          active?: boolean
          business_local?: string
          category?: string
          created_at?: string
          description?: string
          highlight?: boolean
          images?: string[]
          name?: string
          offer_price?: number | null
          price?: number
          product_id?: string
          publish_date?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          sub_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_business_local_fkey"
            columns: ["business_local"]
            isOneToOne: false
            referencedRelation: "business_local"
            referencedColumns: ["business_local_id"]
          },
          {
            foreignKeyName: "product_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "product_sub_category_fkey"
            columns: ["sub_category"]
            isOneToOne: false
            referencedRelation: "sub_category"
            referencedColumns: ["sub_category_id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: Database["public"]["Enums"]["user_account_roles"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: Database["public"]["Enums"]["user_account_roles"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: Database["public"]["Enums"]["user_account_roles"]
        }
        Relationships: []
      }
      sub_category: {
        Row: {
          business_local: string
          category_parent: string
          created_at: string
          description: string | null
          is_active: boolean
          name: string
          sub_category_id: string
        }
        Insert: {
          business_local: string
          category_parent: string
          created_at?: string
          description?: string | null
          is_active?: boolean
          name: string
          sub_category_id?: string
        }
        Update: {
          business_local?: string
          category_parent?: string
          created_at?: string
          description?: string | null
          is_active?: boolean
          name?: string
          sub_category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_category_business_local_fkey"
            columns: ["business_local"]
            isOneToOne: false
            referencedRelation: "business_local"
            referencedColumns: ["business_local_id"]
          },
          {
            foreignKeyName: "sub_category_category_parent_fkey"
            columns: ["category_parent"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["category_id"]
          },
        ]
      }
      user: {
        Row: {
          created_at: string
          custom_avatar_url: string | null
          is_active: boolean
          is_banned: boolean
          name: string | null
          role: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_avatar_url?: string | null
          is_active?: boolean
          is_banned?: boolean
          name?: string | null
          role?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          custom_avatar_url?: string | null
          is_active?: boolean
          is_banned?: boolean
          name?: string | null
          role?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      dinning_table_status: "RESERVED" | "READY" | "NEED CLEAN" | "FREE"
      order_line_status: "CANCELED" | "READY" | "IN PROGRESS" | "DELIVERED"
      order_status: "DELIVERED" | "REQUESTED" | "DISCREPANCY"
      product_status: "DRAFT" | "PUBLISHED" | "DISCONTINUED"
      user_account_roles: "ROOT" | "OWNER" | "ADMIN" | "EMPLOYEE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
