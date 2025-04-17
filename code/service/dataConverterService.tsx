import { SectionPreviewDto, Course, Section, Semester, TeacherDataDto } from '../../App';



 //map sections to their corresponding courses/semesters
 export function compileSectionPreviews(sections: Section[], courses: Course[], semesters: Semester[]){
    let sectionPreviewDtos: SectionPreviewDto[] = []
    let sections_course_map: number[] = new Array(sections.length);
    let sections_semester_map: number[] = new Array(sections.length);
    for (let i = 0; i < sections.length; i++){
        for (let j = 0; j < courses.length; j++){
            if (courses[j].course_id === sections[i].course_id){
                sections_course_map[i] = j;
            }
        }
        for (let j = 0; j < semesters.length; j++){
            if (semesters[j].semester_id === sections[i].semester_id){
                sections_semester_map[i] = j;
            }
        }
    }
    //now build the dtos using those lookup tables
    for (let i = 0; i < sections.length; i++){
        const relatedCourse: Course = courses[sections_course_map[i]];
        const relatedSemester: Semester = semesters[sections_semester_map[i]];
        const sectionDto: SectionPreviewDto = {
            section_id: sections[i].section_id,
            section_identifier: sections[i].section_identifier,
            enrollment_code: sections[i].enrollment_code,
            course_name: relatedCourse.course_name,
            course_identifier: relatedCourse.course_identifier,
            course_subject: relatedCourse.course_subject,
            season: relatedSemester.season,
            year: relatedSemester.year
        }
        sectionPreviewDtos.push(sectionDto); 
    }

    return sectionPreviewDtos;
}

export function compileTeacherData(sectionPreviewDtos: SectionPreviewDto[], coursesCreated: Course[]){
    
    const teacherData: TeacherDataDto = {
        sections: sectionPreviewDtos,
        courses_created: coursesCreated
    }
    return teacherData;
}

