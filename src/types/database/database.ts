export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      business: {
        Row: {
          address: string
          contact_number: string
          country: string
          created_at: string
          document_number: string
          document_type: string
          id: string
          is_active: boolean
          name: string
          postal_code: string
          province: string
          town: string
          user_id: string
        }
        Insert: {
          address: string
          contact_number: string
          country: string
          created_at?: string
          document_number: string
          document_type: string
          id?: string
          is_active?: boolean
          name: string
          postal_code: string
          province: string
          town: string
          user_id: string
        }
        Update: {
          address?: string
          contact_number?: string
          country?: string
          created_at?: string
          document_number?: string
          document_type?: string
          id?: string
          is_active?: boolean
          name?: string
          postal_code?: string
          province?: string
          town?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_establishments: {
        Row: {
          address: string
          business_id: string
          contact_phone: string
          country: string
          created_at: string
          gmt: string | null
          icon_image: string | null
          id: string
          latitude: string | null
          longitude: string | null
          name_abbreviation: string | null
          postal_code: string
          province: string
          town: string
        }
        Insert: {
          address: string
          business_id: string
          contact_phone: string
          country: string
          created_at?: string
          gmt?: string | null
          icon_image?: string | null
          id?: string
          latitude?: string | null
          longitude?: string | null
          name_abbreviation?: string | null
          postal_code: string
          province: string
          town: string
        }
        Update: {
          address?: string
          business_id?: string
          contact_phone?: string
          country?: string
          created_at?: string
          gmt?: string | null
          icon_image?: string | null
          id?: string
          latitude?: string | null
          longitude?: string | null
          name_abbreviation?: string | null
          postal_code?: string
          province?: string
          town?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_establishments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      business_user_assignments: {
        Row: {
          assignment_date: string
          business_establishments_id: string
          id: number
          role: Database["public"]["Enums"]["user_account_roles"]
          user_id: string
        }
        Insert: {
          assignment_date?: string
          business_establishments_id: string
          id?: number
          role: Database["public"]["Enums"]["user_account_roles"]
          user_id: string
        }
        Update: {
          assignment_date?: string
          business_establishments_id?: string
          id?: number
          role?: Database["public"]["Enums"]["user_account_roles"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_user_assignments_business_establishments_id_fkey"
            columns: ["business_establishments_id"]
            isOneToOne: false
            referencedRelation: "business_establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_user_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
          name: Database["public"]["Enums"]["user_account_roles"]
        }
        Insert: {
          created_at?: string
          id?: number
          name: Database["public"]["Enums"]["user_account_roles"]
        }
        Update: {
          created_at?: string
          id?: number
          name?: Database["public"]["Enums"]["user_account_roles"]
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          custom_avatar_url: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          custom_avatar_url?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          custom_avatar_url?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      users_session: {
        Row: {
          action: Database["public"]["Enums"]["user_session_actions"]
          business_establishment_id: string
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["user_session_actions"]
          business_establishment_id: string
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["user_session_actions"]
          business_establishment_id?: string
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_session_business_establishment_id_fkey"
            columns: ["business_establishment_id"]
            isOneToOne: false
            referencedRelation: "business_establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_session_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
      category_status: "DRAFT" | "PUBLISHED" | "DISCONTINUED"
      product_status: "DRAFT" | "PUBLISHED" | "DISCONTINUED"
      user_account_roles:
        | "ROOT"
        | "OWNER"
        | "ADMIN"
        | "EMPLOYEE"
        | "TPV"
        | "CHEF"
      user_session_actions: "LOGIN" | "LOGOUT" | "SWITCH"
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

