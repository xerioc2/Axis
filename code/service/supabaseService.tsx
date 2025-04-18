import supabase from "../utils/supabase";
import type { User, SectionTeacher, Section, SectionPreviewDto, Course, Semester, TeacherDataDto, Enrollment, StudentDataDto } from "@/App";
import { compileSectionPreviews, compileTeacherData } from "./dataConverterService";


export async function signup(email: string, password: string, firstName: string, lastName: string, userTypeId: number, schoolId: number) {
    try{
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    user_type_id: userTypeId,
                    school_id: 1
                }
            }
        });
        if (error){
            console.log(`Error while signing up: ${error.code}, ${error.message}, ${error.cause}`);
        }
        else if(data){
            return data;
        }
        else{
            console.log("Unexpected error while signing up. Please contact support.");
        }
    }
    catch (err) {
        console.log(`Unexpected error while signing up: ${err}`);
    }
    return null;
}


export async function login(email: string, password: string){
    try{
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error){
            if (error.code === "invalid_credentials"){
                console.log("Invalid credentials. Please check your email and password and try again.");
            }
            else{
                console.log("Unable to login. Please make sure you have an account and double check your credentials.");
            } 
        }
        else if (data){
            const { data: userData, error: userError } = await supabase.from('users').select("*").eq("user_id", data.user.id);
            if (userError){
                console.log(`Unable to find that user in public.users... yet the user with email ${data.user.email} exists in auth.users...`);
            }
            else if (userData && userData.length > 0){
                const user: User = userData[0];
                return user;
            }
            else{
                console.log("Unexpected error occured while pulling the user from public.users... please contact support.")
            }
        }
        else{
            console.log("Unexpected error occured while logging in. Please contact support.");
        }
    } catch(err) {
        console.log('Error with login request: ', err)
    }
    return null;
}

//runs when a teacher logs in
export async function getSectionPreviews(userId: string){
    //first query section_teachers, 
    try{
        let sections: Section[] = [];
        let courses_taught: Course[] = [];
        let semesters: Semester[] = [];

        let courses_created: Course[] = [];

        //fetching section_teachers so that we know the relevant sections for this teacher.
        const { data: sectionTeacherData, error: sectionTeacherError } = await supabase
            .from("section_teachers")
            .select("*")
            .eq("teacher_id", userId);
        
        if (sectionTeacherError){
            console.log("Error getting section_teachers: ", sectionTeacherError.message);
        }
        else if (sectionTeacherData){
            if (sectionTeacherData.length == 0){
                console.log("No section teachers entries for this teacher. This teacher has not taught any sections.");
                return null;
            }
            const sectionTeachers: SectionTeacher[] = sectionTeacherData as SectionTeacher[];

            //now query the sections themselves using the section ids
            const section_ids: number[] = sectionTeachers.map(section => section.section_id); 
            const potentialSections: Section[] | null = await getSectionsByIds(section_ids);
            if (!potentialSections){
                console.log("Error getting sections while getting teachers data.");
                return null;
            }
            sections = potentialSections;

            //now query the courses they've taught using the course id
            const course_ids: number[] = sections.map(section => section.course_id);
            const potentialCoursesTaught: Course[] | null = await getCoursesByIds(course_ids);
            if (!potentialCoursesTaught){
                console.log("Error getting courses taught while getting teachers data.");
                return null;
            }
            courses_taught = potentialCoursesTaught;

            const semester_ids: number[] = sections.map(section => section.semester_id);
            const potentialSemesters: Semester[] | null = await getSemestersByIds(semester_ids);
            if (!potentialSemesters){
                console.log("Error getting semesters while getting teachers data.");
                return null;
            }
            semesters = potentialSemesters;
            const sectionPreviewDtos: SectionPreviewDto[] = compileSectionPreviews(sections, courses_taught, semesters);
            return sectionPreviewDtos;
            
            //now get courses this teacher has created
            //the course ids will be different here, we can use the teacher_id to query those
            
            //Use the TeacherData data transfer object to pass all 4 lists back
            
        }
        else{
            console.log("Unexpected error getting section_teachers while getting teachers data.");
        }
    } catch(err) {
        console.log("Unexpected error while getting teachers data: ", err);
    }
    return null;
}

export async function getTeacherData(teacherId: string){
    let sectionPreviews: SectionPreviewDto[] | null = await getSectionPreviews(teacherId);
    if (!sectionPreviews){
        sectionPreviews = []
    }
    let coursesTaught: Course[] | null = await getCoursesByCreatorId(teacherId);
    if (!coursesTaught){
        coursesTaught = []
    }
    const teacherData: TeacherDataDto = compileTeacherData(sectionPreviews, coursesTaught);
    return teacherData;
}

export async function getStudentData(studentId: string){
    const potentialSectionPreviews: SectionPreviewDto[] | null = await getSectionsByStudentId(studentId);
    if (!potentialSectionPreviews){
        console.log("Error getting sectionPreviews");
        return null;
    }
    const sectionPreviews: SectionPreviewDto[] = potentialSectionPreviews;
    const studentDataDto: StudentDataDto = {sections: sectionPreviews};
    console.log(`Successfully fetched studentdata... sectionPreviews.length=${sectionPreviews.length}`)
    return studentDataDto; 
}

export async function getSectionsByIds(section_ids: number[]){
    const { data: sectionData, error: sectionError } = await supabase
        .from("sections")
        .select("*")
        .in("section_id", section_ids);
    if (sectionError){
        console.log("Error getting sections: ", sectionError);
    }
    else if (sectionData){
        return sectionData as Section[];
    }
    else{
        console.log("Unexpected error getting sections");
    }
    return null;
}

export async function getCoursesByCreatorId(creator_id: string){
    //the course ids will be different here, we can use the teacher_id to query those
    const { data: courseCreatedData, error: courseCreatedError } = await supabase
        .from("courses")
        .select("*")
        .eq("creator_id", creator_id);

    if (courseCreatedError){
        console.log("Error getting created courses: ", courseCreatedError.name, courseCreatedError.message);
    }
    else if (courseCreatedData){
        return courseCreatedData as Course[];
    }
    else {
        console.log("Unexpected error getting created courses");
    }
    return null;
}

export async function getCoursesByIds(course_ids: number[]){
    const { data: courseTaughtData, error: courseTaughtError} = await supabase
        .from("courses")
        .select("*")
        .in('course_id', course_ids);
    
    if (courseTaughtError){
        console.log("");
    }
    else if (courseTaughtData){
        return courseTaughtData as Course[];
    }
    else{
        console.log("Unexpected error getting courses");
    }
    return null;
}

export async function getSemestersByIds(semester_ids: number[]){
    const { data: semesterData, error: semesterError } = await supabase
        .from("semesters")
        .select("*")
        .in("semester_id", semester_ids);
    if (semesterError){
        console.log("Error getting semesters: ", semesterError);
    }
    else if (semesterData){
        return semesterData as Semester[];
    }
    else{
        console.log("Unexpected error getting semesters");
    }
    return null;
}


export async function getEnrollmentsBySectionId(sectionId: number){
    try{
        const { data: enrollmentData, error: enrollmentError } = await supabase
            .from("enrollments")
            .select("*")
            .eq("section_id", sectionId);
        if (enrollmentError){
            console.log(`Error getting enrollment data from section ${sectionId}: ${enrollmentError}`);
        }
        else if (enrollmentData){
            console.log(`retrieved enrollmentData successfully: ${enrollmentData.length} records, data[0]=${enrollmentData[0].student_id}`);
            return enrollmentData as Enrollment[];
        }
        else{
            console.log("Unexpected error occurred while getting enrollments for section id ", sectionId);
        }
    } catch(err){
        console.log("Exception thrown while getting enrollments for section id ", sectionId, ': ', err);
    }
    return null;
}

export async function getStudentsBySectionId(sectionId: number){
    try{
        const potentialEnrollments: Enrollment[] | null = await  getEnrollmentsBySectionId(sectionId);
        if (!potentialEnrollments){
            console.log("Error getting students by section id, enrollments was null: ");
        }
        else if (potentialEnrollments){
            const actualEnrollments: Enrollment[] = potentialEnrollments;
            const studentIds = actualEnrollments.map(enrollment => (enrollment.student_id));
            console.log(`mapped enrollmentData to studentIds: ${studentIds}`);
            let enrolledStudents: User[] = []
            for(let i = 0; i < studentIds.length; i++){
                console.log(`attempting to get student with id ${studentIds[i]}`);
                const { data: studentData, error: studentError} = await supabase
                    .from("users")
                    .select("*")
                    .eq("user_id", studentIds[i]);
                if (studentError){
                    console.log(`Error getting student account for student id ${studentIds[i]}: ${studentError}`);
                }
                else if (studentData && studentData.length > 0){
                    console.log(`Retrieved student with id ${studentIds[i]}, pushing to enrolledStudents`);
                    const student: User = studentData[0] as User;
                    enrolledStudents.push(student)
                }
                else{
                    console.log(`Unexpected error getting student id ${studentIds[i]}`);
                }
            }
            return enrolledStudents;
        }
        else{
            console.log("Unexpected error getting enrollments");
        }
    } catch (err) {
        console.log("Exception thrown while getting students by section id: ", err);
    }
    return null;
}

export async function getTeachersBySectionId(sectionId: number){
    try{
        const { data: sectionTeacherData, error: sectionTeacherError } = await supabase
            .from("section_teachers")
            .select("*")
            .eq("section_id", sectionId);
        if (sectionTeacherError){
            console.log("Error getting section teachers for section id ", sectionId, ": ", sectionTeacherError);
        }
        else if (sectionTeacherData){
            const sectionTeachers: SectionTeacher[] = sectionTeacherData as SectionTeacher[];
            //now get the actual teachers
            const teacherIds: string[] = sectionTeachers.map(sectionTeacher => (sectionTeacher.teacher_id));
            let teachers: User[] = [];
            for (let i = 0; i < teacherIds.length; i++){
                const { data: teacherData, error: teacherError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("user_id", teacherIds[i]);
                if (teacherError){
                    console.log(`Error getting teacher id ${teacherIds[i]}`);
                }
                else if (teacherData && teacherData.length===1){
                    const teacher: User = teacherData[0] as User;
                    teachers.push(teacher);
                }
                else{
                    console.log(`Unexpected error getting teacher id ${teacherIds[i]} for section id ${sectionId}`);
                }
            }
            return teachers;
        }
        else{
            console.log("Unexpected error while getting section teachers for section id ", sectionId);
        }
    } catch(err){
        console.log("Exception thrown while getting teachers for section ", sectionId);
    }
    return null;
}

export async function getSectionsByStudentId(studentId: string){
    try{
        const {data: enrollmentsData, error: enrollmentsError} = await supabase
            .from("enrollments")
            .select("section_id")
            .eq("student_id", studentId)
            .is("date_disenrolled", null);
        if (enrollmentsError){
            console.log("Error getting enrollments: ", enrollmentsError);
        }
        else if (enrollmentsData){
            const section_ids = new Array(enrollmentsData.length);
            for (let i = 0; i < section_ids.length; i++){
                section_ids[i] = enrollmentsData[i].section_id;
            }

            const potentialSections: Section[] | null = await getSectionsByIds(section_ids);
            if (!potentialSections){
                console.log("Error getting sections");
            }
            else{
                const sections: Section[] = potentialSections;
                //need courses and semesters to use dataConverter
                const course_ids: number[] = sections.map(section => (section.course_id));
                const potentialCoursesTaken: Course[] | null = await getCoursesByIds(course_ids);
                if (!potentialCoursesTaken){
                    console.log("Error getting courses taken");
                    return null;
                }
                const courses_taken: Course[] = potentialCoursesTaken;
                const semester_ids: number[] = sections.map(section => (section.semester_id));
                const potentialSemesters: Semester[] | null = await getSemestersByIds(semester_ids);
                if (!potentialSemesters){
                    console.log("Error getting semesters");
                    return null;
                }
                const semesters: Semester[] = potentialSemesters
                const sectionPreviews: SectionPreviewDto[] = compileSectionPreviews(sections, courses_taken, semesters);
                return sectionPreviews;
            }
        }
    }
    catch(err){
        console.log("Exception thrown in getSectionsByStudentId: ", err);
    }

    return null;
}

export async function enrollInSection(enrollmentCode: string, studentId: string){
    //need section_id where enrollmentCode == section.enrollment_code
    console.log("starting enrollment...");
    try{
        const { data: sectionData, error: sectionError } = await supabase
            .from('sections')
            .select("*")
            .eq("enrollment_code", enrollmentCode);
        if (sectionError){
            console.log("Error joining section by enrollment code: could not fetch section with that enrollment code: ", sectionError);
            return null;
        }
        if (sectionData && sectionData.length === 0){
            console.log("No section has the enrollment code: ", enrollmentCode);
            return undefined;
        }
        if (sectionData && sectionData.length > 0){
            console.log("successfully retrieved the section... section_id=", sectionData[0].section_id);
            const section: Section = sectionData[0];
            const section_id: number = section.section_id;
            
            console.log("checking if there are previous enrollments by this student for this section");
            // Check if enrollment already exists
            const { data: existingEnrollment, error: checkError } = await supabase
                .from('enrollments')
                .select()
                .eq('student_id', studentId)
                .eq('section_id', section_id);
                
            if (checkError) {
                console.log("Error checking for existing enrollment: ", checkError);
                return null;
            }
            
            // If enrollment exists, return false
            if (existingEnrollment && existingEnrollment.length > 0) {
                console.log("Student is already enrolled in this section");
                return null;
            }
            console.log("successfully checked enrollment records, this student has not previously enrolled in this section...");
            console.log("inserting the enrollment record...");
            // Insert the enrollment record
            const { data, error } = await supabase
                .from('enrollments')
                .insert({student_id: studentId, section_id: section_id});
            
            if(error){
                console.log("Error joining section by enrollment code: could not insert enrollment record: ", error);
                return null;
            }
            
            console.log("successfully inserted enrollment record");
            // Get course data for the section
            const potentialCourse: Course[] | null = await getCoursesByIds([section.course_id]);
            if (!potentialCourse || potentialCourse.length === 0) {
                console.log("Error getting course data for enrolled section");
                return null;
            }
            
            // Get semester data for the section
            const potentialSemester: Semester[] | null = await getSemestersByIds([section.semester_id]);
            if (!potentialSemester || potentialSemester.length === 0) {
                console.log("Error getting semester data for enrolled section");
                return null;
            }
            
            // Create and return the SectionPreviewDto
            const sectionPreview: SectionPreviewDto = {
                section_id: section.section_id,
                section_identifier: section.section_identifier,
                enrollment_code: section.enrollment_code,
                season: potentialSemester[0].season,
                year: potentialSemester[0].year,
                course_name: potentialCourse[0].course_name,
                course_identifier: potentialCourse[0].course_identifier,
                course_subject: potentialCourse[0].course_subject
            };
            
            return sectionPreview;
        }
    }
    catch(err){
        console.log("Exception thrown in enrollInSection: ", err);
    }
    return null;
}


