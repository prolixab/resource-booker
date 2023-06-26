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
      Bookings: {
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
            foreignKeyName: "Bookings_resource_fkey"
            columns: ["resource"]
            referencedRelation: "Resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Bookings_user_fkey"
            columns: ["user"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      Resources: {
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
            foreignKeyName: "Resources_room_fkey"
            columns: ["room"]
            referencedRelation: "Rooms"
            referencedColumns: ["id"]
          }
        ]
      }
      Rooms: {
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
