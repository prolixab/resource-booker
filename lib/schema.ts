export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          end_time: string
          id: number
          note: string | null
          resource: number
          start_time: string
          user: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: number
          note?: string | null
          resource: number
          start_time: string
          user: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: number
          note?: string | null
          resource?: number
          start_time?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_resource_fkey"
            columns: ["resource"]
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_fkey"
            columns: ["user"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      resources: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          model: string | null
          name: string
          room: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          model?: string | null
          name: string
          room?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          model?: string | null
          name?: string
          room?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_room_fkey"
            columns: ["room"]
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
      rooms: {
        Row: {
          capacity: number | null
          code: string
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          capacity?: number | null
          code: string
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          capacity?: number | null
          code?: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
