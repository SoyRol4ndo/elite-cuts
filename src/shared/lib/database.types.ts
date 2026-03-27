export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          role: 'customer' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
        };
        Relationships: [];
      };
      barbers: {
        Row: {
          id: string;
          name: string;
          specialty: string;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          specialty: string;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          specialty?: string;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          name: 'haircut' | 'beard' | 'facial_cleaning';
          label: string;
          description: string;
          duration_minutes: number;
          price: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: 'haircut' | 'beard' | 'facial_cleaning';
          label: string;
          description: string;
          duration_minutes: number;
          price: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: 'haircut' | 'beard' | 'facial_cleaning';
          label?: string;
          description?: string;
          duration_minutes?: number;
          price?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          customer_id: string;
          barber_id: string;
          service_id: string;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          barber_id: string;
          service_id: string;
          appointment_date: string;
          start_time: string;
          end_time: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          barber_id?: string;
          service_id?: string;
          appointment_date?: string;
          start_time?: string;
          end_time?: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'appointments_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appointments_barber_id_fkey';
            columns: ['barber_id'];
            isOneToOne: false;
            referencedRelation: 'barbers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appointments_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: { [K in never]: never };
    Functions: { [K in never]: never };
    Enums: { [K in never]: never };
    CompositeTypes: { [K in never]: never };
  };
}
