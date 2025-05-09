import type { SectionPreviewDto, User } from "@/App";

export type RootStackParamList = {
    SignUp: undefined; // SignUp screen takes NO parameters
    Login: undefined; // Login screen takes NO parameters
    TeacherDashboard: User;
    StudentDashboard: User;
    Profile: { user: User };
    TeacherSectionDetails: {user: User, sectionPreview: SectionPreviewDto};
    StudentSectionDetails: {user: User, sectionPreview: SectionPreviewDto};
    TeacherGradeView: {user: User, sectionPreview: SectionPreviewDto, student: User};
    StudentGradeView: {user: User, sectionPreview: SectionPreviewDto}
    ResetPassword: { token: string }; //
  };