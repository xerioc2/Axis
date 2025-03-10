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
      concept: {
        Row: {
          concept_description: string | null
          concept_id: number
          concept_title: string
          topic_id: number
        }
        Insert: {
          concept_description?: string | null
          concept_id?: number
          concept_title: string
          topic_id: number
        }
        Update: {
          concept_description?: string | null
          concept_id?: number
          concept_title?: string
          topic_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_topic_id"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["topic_id"]
          },
        ]
      }
      course: {
        Row: {
          course_code: number | null
          course_id: number
          course_name: string
          course_subject: string | null
          creator_id: string
        }
        Insert: {
          course_code?: number | null
          course_id?: number
          course_name: string
          course_subject?: string | null
          creator_id: string
        }
        Update: {
          course_code?: number | null
          course_id?: number
          course_name?: string
          course_subject?: string | null
          creator_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_course_creator"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      enrollment: {
        Row: {
          date_enroll_invite_responded: string | null
          date_enroll_invite_sent: string
          enrollment_id: number
          is_enrolled: boolean
          section_id: number
          student_id: string
        }
        Insert: {
          date_enroll_invite_responded?: string | null
          date_enroll_invite_sent: string
          enrollment_id?: number
          is_enrolled: boolean
          section_id: number
          student_id: string
        }
        Update: {
          date_enroll_invite_responded?: string | null
          date_enroll_invite_sent?: string
          enrollment_id?: number
          is_enrolled?: boolean
          section_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_section_id"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "section"
            referencedColumns: ["section_id"]
          },
          {
            foreignKeyName: "fk_student_id"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      point: {
        Row: {
          concept_id: number
          is_test_point: boolean
          point_id: number
          section_id: number
        }
        Insert: {
          concept_id: number
          is_test_point: boolean
          point_id?: number
          section_id: number
        }
        Update: {
          concept_id?: number
          is_test_point?: boolean
          point_id?: number
          section_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_concept_id"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concept"
            referencedColumns: ["concept_id"]
          },
          {
            foreignKeyName: "fk_section_id"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "section"
            referencedColumns: ["section_id"]
          },
        ]
      }
      point_status: {
        Row: {
          point_status_id: number
          point_status_name: string
        }
        Insert: {
          point_status_id?: number
          point_status_name: string
        }
        Update: {
          point_status_id?: number
          point_status_name?: string
        }
        Relationships: []
      }
      school: {
        Row: {
          address: string | null
          city: string | null
          name: string
          school_id: number
          school_type_id: number
          state: string | null
          telephone: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          name: string
          school_id?: number
          school_type_id: number
          state?: string | null
          telephone?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          name?: string
          school_id?: number
          school_type_id?: number
          state?: string | null
          telephone?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_school_type_id"
            columns: ["school_type_id"]
            isOneToOne: false
            referencedRelation: "school_type"
            referencedColumns: ["school_type_id"]
          },
        ]
      }
      school_type: {
        Row: {
          school_type_id: number
          school_type_name: string
        }
        Insert: {
          school_type_id?: number
          school_type_name: string
        }
        Update: {
          school_type_id?: number
          school_type_name?: string
        }
        Relationships: []
      }
      section: {
        Row: {
          course_id: number
          section_id: number
          section_number: number
          semester_id: number
        }
        Insert: {
          course_id: number
          section_id?: number
          section_number: number
          semester_id: number
        }
        Update: {
          course_id?: number
          section_id?: number
          section_number?: number
          semester_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_course_id"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "fk_semester_id"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semester"
            referencedColumns: ["semester_id"]
          },
        ]
      }
      section_teacher: {
        Row: {
          section_id: number
          section_teacher_id: number
          teacher_id: string
        }
        Insert: {
          section_id: number
          section_teacher_id?: number
          teacher_id: string
        }
        Update: {
          section_id?: number
          section_teacher_id?: number
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_section_id"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "section"
            referencedColumns: ["section_id"]
          },
          {
            foreignKeyName: "fk_teacher_id"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      semester: {
        Row: {
          season: string
          semester_id: number
          year: number
        }
        Insert: {
          season: string
          semester_id?: number
          year: number
        }
        Update: {
          season?: string
          semester_id?: number
          year?: number
        }
        Relationships: []
      }
      student_point: {
        Row: {
          last_status_update: string | null
          point_id: number
          point_status_id: number
          student_id: string
          student_point_id: number
        }
        Insert: {
          last_status_update?: string | null
          point_id: number
          point_status_id: number
          student_id: string
          student_point_id?: number
        }
        Update: {
          last_status_update?: string | null
          point_id?: number
          point_status_id?: number
          student_id?: string
          student_point_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_point_id"
            columns: ["point_id"]
            isOneToOne: false
            referencedRelation: "point"
            referencedColumns: ["point_id"]
          },
          {
            foreignKeyName: "fk_point_status_id"
            columns: ["point_status_id"]
            isOneToOne: false
            referencedRelation: "point_status"
            referencedColumns: ["point_status_id"]
          },
          {
            foreignKeyName: "fk_student_id"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      topic: {
        Row: {
          course_id: number
          topic_description: string | null
          topic_id: number
          topic_title: string
        }
        Insert: {
          course_id: number
          topic_description?: string | null
          topic_id?: number
          topic_title: string
        }
        Update: {
          course_id?: number
          topic_description?: string | null
          topic_id?: number
          topic_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_course_id"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course"
            referencedColumns: ["course_id"]
          },
        ]
      }
      user: {
        Row: {
          email: string
          first_name: string
          last_name: string
          school_id: number
          user_id: string
          user_type_id: number
        }
        Insert: {
          email: string
          first_name: string
          last_name: string
          school_id: number
          user_id: string
          user_type_id: number
        }
        Update: {
          email?: string
          first_name?: string
          last_name?: string
          school_id?: number
          user_id?: string
          user_type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_school_id"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "fk_user_type_id"
            columns: ["user_type_id"]
            isOneToOne: false
            referencedRelation: "user_type"
            referencedColumns: ["user_type_id"]
          },
        ]
      }
      user_type: {
        Row: {
          user_type_id: number
          user_type_name: string
        }
        Insert: {
          user_type_id?: number
          user_type_name: string
        }
        Update: {
          user_type_id?: number
          user_type_name?: string
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
