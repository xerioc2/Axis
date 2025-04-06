import supabase from "./supabase";
import type { User, SectionTeacher, Section, Course, Semester, TeacherDataDto } from "@/App";


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
export async function getTeacherData(teacherId: string){
    //first query section_teachers, 
    try{
        let sections: Section[] = [];
        let courses_taught: Course[] = [];
        let semesters: Semester[] = [];
        let courses_created: Course[] = [];

        const { data: sectionTeacherData, error: sectionTeacherError } = await supabase
            .from("section_teachers")
            .select("*")
            .eq("teacher_id", teacherId);
        
        if (sectionTeacherError){
            console.log("Error getting section_teachers: ", sectionTeacherError.message);
        }
        else if (sectionTeacherData && sectionTeacherData.length > 0){
            const sectionTeachers: SectionTeacher[] = sectionTeacherData as SectionTeacher[];
            //now query the sections themselves using the section ids
            const section_ids: number[] = sectionTeachers.map(section => section.section_id); 
            const { data: sectionData, error: sectionError } = await supabase
                .from("sections")
                .select("*")
                .in("section_id", section_ids);
            if (sectionError){
                console.log("Error getting sections: ", sectionError);
            }
            else if (sectionData && sectionData.length > 0){
                sections = sectionData as Section[];
                //now query the courses they've taught using the course id
                const course_ids: number[] = sections.map(section => section.course_id);
                const { data: courseTaughtData, error: courseTaughtError} = await supabase
                    .from("courses")
                    .select("*")
                    .in('course_id', course_ids);
                
                if (courseTaughtError){
                    console.log("");
                }
                else if (courseTaughtData){
                    courses_taught = courseTaughtData as Course[];
                }
                else{
                    console.log("Unexpected error getting courses");
                }
                
                const semester_ids: number[] = sections.map(section => section.semester_id);
                const { data: semesterData, error: semesterError } = await supabase
                    .from("semesters")
                    .select("*")
                    .in("semester_id", semester_ids);
                if (semesterError){
                    console.log("Error getting semesters: ", semesterError);
                }
                else if (semesterData){
                    semesters = semesterData as Semester[];
                }
                else{
                    console.log("Unexpected error getting semesters");
                }
            }
            else{
                console.log("Unexpected error getting sections");
            }
            
            //now get courses this teacher has created
            //the course ids will be different here, we can use the teacher_id to query those
            const { data: courseCreatedData, error: courseCreatedError } = await supabase
                .from("courses")
                .select("*")
                .eq("creator_id", teacherId);
            
            if (courseCreatedError){
                console.log("Error getting created courses: ", courseCreatedError.name, courseCreatedError.message);
            }
            else if (courseCreatedData){
                courses_created = courseCreatedData as Course[];
            }
            else {
                console.log("Unexpected error getting created courses");
            }

            //Use the TeacherData data transfer object to pass all 4 lists back
            const teacherData: TeacherDataDto = {
                sections: sections,
                courses_taught: courses_taught,
                semesters: semesters,
                courses_created: courses_created
            }
            return teacherData;
        }
        else{
            console.log("Unexpected error getting section_teachers");
        }
    } catch(err) {
        console.log("Error getting sections by teacher id: ", err);
    }
    return null;
}


