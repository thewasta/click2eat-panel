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
      categories: {
        Row: {
          business_establishment_id: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          name: string
          offer: number | null
          status: Database["public"]["Enums"]["category_status"]
        }
        Insert: {
          business_establishment_id: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          offer?: number | null
          status?: Database["public"]["Enums"]["category_status"]
        }
        Update: {
          business_establishment_id?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          offer?: number | null
          status?: Database["public"]["Enums"]["category_status"]
        }
        Relationships: [
          {
            foreignKeyName: "categories_business_establishment_id_fkey"
            columns: ["business_establishment_id"]
            isOneToOne: false
            referencedRelation: "business_establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      category_subcategories: {
        Row: {
          category_id: string
          created_at: string
          subcategory_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          subcategory_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          subcategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_subcategories_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_table_location: {
        Row: {
          created_at: string
          establishment_id: string
          id: string
          name: string
          status: Database["public"]["Enums"]["location_status"]
        }
        Insert: {
          created_at?: string
          establishment_id: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["location_status"]
        }
        Update: {
          created_at?: string
          establishment_id?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["location_status"]
        }
        Relationships: [
          {
            foreignKeyName: "establishment_table_location_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "business_establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_tables: {
        Row: {
          created_at: string
          establishment_id: string
          id: string
          location_id: string
          name: string
          status: Database["public"]["Enums"]["table_status"]
        }
        Insert: {
          created_at?: string
          establishment_id: string
          id?: string
          location_id: string
          name: string
          status?: Database["public"]["Enums"]["table_status"]
        }
        Update: {
          created_at?: string
          establishment_id?: string
          id?: string
          location_id?: string
          name?: string
          status?: Database["public"]["Enums"]["table_status"]
        }
        Relationships: [
          {
            foreignKeyName: "establishment_tables_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "business_establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishment_tables_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "establishment_table_location"
            referencedColumns: ["id"]
          },
        ]
      }
      image_urls: {
        Row: {
          created_at: string
          expires_at: string
          id: number
          image_path: string
          url: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: number
          image_path: string
          url: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: number
          image_path?: string
          url?: string
        }
        Relationships: []
      }
      order_item_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          order_item_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          order_item_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          order_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_item_comments_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          attended_by: string | null
          created_at: string
          establishment_id: string | null
          establishment_table_dinner_id: string
          id: string
          method: string
          order_status: Database["public"]["Enums"]["order_status"]
          payment_method: string
          sub_total: number
        }
        Insert: {
          attended_by?: string | null
          created_at?: string
          establishment_id?: string | null
          establishment_table_dinner_id: string
          id?: string
          method?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_method: string
          sub_total: number
        }
        Update: {
          attended_by?: string | null
          created_at?: string
          establishment_id?: string | null
          establishment_table_dinner_id?: string
          id?: string
          method?: string
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_method?: string
          sub_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "establishment_orders_attended_by_fkey"
            columns: ["attended_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishment_orders_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "business_establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishment_orders_establishment_table_dinner_id_fkey"
            columns: ["establishment_table_dinner_id"]
            isOneToOne: false
            referencedRelation: "establishment_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          extra_price: number | null
          group_id: number
          id: number
          is_required: boolean
          name: string
        }
        Insert: {
          created_at?: string
          extra_price?: number | null
          group_id: number
          id?: number
          is_required?: boolean
          name: string
        }
        Update: {
          created_at?: string
          extra_price?: number | null
          group_id?: number
          id?: number
          is_required?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "product_variants_group"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants_group: {
        Row: {
          business_establishment_id: string
          created_at: string
          id: number
          name: string
          product_id: string
        }
        Insert: {
          business_establishment_id: string
          created_at?: string
          id?: number
          name: string
          product_id: string
        }
        Update: {
          business_establishment_id?: string
          created_at?: string
          id?: number
          name?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_group_business_establishment_id_fkey"
            columns: ["business_establishment_id"]
            isOneToOne: false
            referencedRelation: "business_establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_group_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          business_establishment_id: string
          category_id: string
          created_at: string
          description: string | null
          highlight: boolean
          id: string
          images: string[] | null
          name: string
          offer: number | null
          price: number
          publish_date: string | null
          status: Database["public"]["Enums"]["product_status"]
          sub_category_id: string | null
          unpublish_at: string | null
        }
        Insert: {
          business_establishment_id: string
          category_id: string
          created_at?: string
          description?: string | null
          highlight?: boolean
          id?: string
          images?: string[] | null
          name: string
          offer?: number | null
          price: number
          publish_date?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          sub_category_id?: string | null
          unpublish_at?: string | null
        }
        Update: {
          business_establishment_id?: string
          category_id?: string
          created_at?: string
          description?: string | null
          highlight?: boolean
          id?: string
          images?: string[] | null
          name?: string
          offer?: number | null
          price?: number
          publish_date?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          sub_category_id?: string | null
          unpublish_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_business_establishment_id_fkey"
            columns: ["business_establishment_id"]
            isOneToOne: false
            referencedRelation: "business_establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customer: {
        Row: {
          id: string
          stripe_customer_id: string
        }
        Insert: {
          id: string
          stripe_customer_id: string
        }
        Update: {
          id?: string
          stripe_customer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customer_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_payment_token: {
        Row: {
          created_at: string
          expired_at: string
          id: number
          is_pending: boolean
          price_id: string
          stripe_session_id: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expired_at: string
          id?: number
          is_pending?: boolean
          price_id: string
          stripe_session_id: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expired_at?: string
          id?: number
          is_pending?: boolean
          price_id?: string
          stripe_session_id?: string
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_payment_token_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "stripe_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_payment_token_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_prices: {
        Row: {
          active: boolean
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"]
          unit_amount: number | null
        }
        Insert: {
          active: boolean
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          product_id?: string | null
          trial_period_days?: number | null
          type: Database["public"]["Enums"]["pricing_type"]
          unit_amount?: number | null
        }
        Update: {
          active?: boolean
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"]
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stripe_products"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_products: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string
        }
        Insert: {
          active: boolean
          created_at?: string
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string
        }
        Relationships: []
      }
      sub_categories: {
        Row: {
          business_establishment_id: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          name: string
          offer: number | null
          status: Database["public"]["Enums"]["category_status"]
        }
        Insert: {
          business_establishment_id: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name: string
          offer?: number | null
          status?: Database["public"]["Enums"]["category_status"]
        }
        Update: {
          business_establishment_id?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          name?: string
          offer?: number | null
          status?: Database["public"]["Enums"]["category_status"]
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_business_establishment_id_fkey"
            columns: ["business_establishment_id"]
            isOneToOne: false
            referencedRelation: "business_establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"]
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status: Database["public"]["Enums"]["subscription_status"]
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "stripe_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
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
          business_establishment_id: string | null
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["user_session_actions"]
          business_establishment_id?: string | null
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["user_session_actions"]
          business_establishment_id?: string | null
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
      user_has_establishment_access: {
        Args: {
          establishment_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      category_status: "DRAFT" | "PUBLISHED" | "DISCONTINUED"
      location_status: "RESERVED" | "ACTIVE" | "INACTIVE"
      order_status:
          | "PENDING"
          | "IN PROGRESS"
          | "DELIVERED"
          | "PAID"
          | "CANCELED"
          | "DISCREPANCY"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      product_status: "DRAFT" | "PUBLISHED" | "DISCONTINUED"
      subscription_status:
          | "trialing"
          | "active"
          | "canceled"
          | "incomplete"
          | "incomplete_expired"
          | "past_due"
          | "unpaid"
          | "paused"
      table_status: "ACTIVE" | "RESERVED" | "INACTIVE"
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

