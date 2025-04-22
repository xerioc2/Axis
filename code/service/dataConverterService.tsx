import { Point, StudentPoint, StudentPointDto, SectionPreviewDto, Course, Section, Semester, TeacherDataDto, User, Topic, Concept, GradeViewDto } from '../../App';
import { getTopicsByCourseId, getConceptsByTopicId, getPointsByConceptId, getStudentPointsByPointIds } from './supabaseService';


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
            course_id: sections[i].course_id,
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


/* This function is a bit of a nightmare, i will admit. 
But, it is basically the core of the application, in my defense.
 */
/* if a student needs the GradeView, then user === student */
export async function compileGradeViewData(user: User, sectionPreview: SectionPreviewDto, student: User) {
    
    const gradeViewData: GradeViewDto = {
        topicsToConcepts: [],
        conceptsToPoints: [],
        indexAssociations: []
    }

    const potentialTopics: Topic[] | null = await getTopicsByCourseId(sectionPreview.course_id);
    if (!potentialTopics) {
        console.log("Error getting topics, cannot compile GradeView Data");
        return null;
    }
    const topics: Topic[] = potentialTopics;
    for (let i = 0; i < topics.length; i++) {
        const potentialConcepts: Concept[] | null = await getConceptsByTopicId(topics[i].topic_id);
        if (!potentialConcepts) {
            console.log(`Error getting concepts for topic ${topics[i].topic_id}.`);
            continue;
        }
        
        const concepts: Concept[] = potentialConcepts;
        console.log(`successfully retrieved concepts for topic ${topics[i].topic_id}, concepts.length=${concepts.length}`);
        
        gradeViewData.topicsToConcepts.push({topic: topics[i], concepts: concepts})
        
        
        //get points for each concept
        for (let j = 0; j < concepts.length; j++) {
            const potentialPoints: Point[] | null = await getPointsByConceptId(concepts[j].concept_id);
            if (!potentialPoints) {
                console.log("Error getting points for concept: ", concepts[j].concept_id);
                continue;
            } 
            const points: Point[] = potentialPoints;
            
            // Filter points by section_id to only get points for the current section
            const sectionPoints = points.filter(point => point.section_id === sectionPreview.section_id);
            if (sectionPoints.length === 0) {
                console.log(`No points for concept ${concepts[j].concept_id} in this section`);
                gradeViewData.conceptsToPoints.push({
                    concept: concepts[j],
                    points: []
                });
                continue;
            }
            
            const pointIds = sectionPoints.map(point => point.point_id);
            
            //now go for StudentPoints from these point_ids
            const potentialStudentPoints: StudentPoint[] | null = await getStudentPointsByPointIds(pointIds);
            if (!potentialStudentPoints) {
                console.log("Error getting student points for concept: ", concepts[j].concept_id);
                continue;
            }
            
            // IMPORTANT FIX: Filter student points to only include points for the specific student
            const studentPoints: StudentPoint[] = potentialStudentPoints.filter(sp => sp.student_id === student.user_id);
            
            if (studentPoints.length === 0) {
                console.log(`No student points for student ${student.user_id} for concept ${concepts[j].concept_id}`);
                gradeViewData.conceptsToPoints.push({
                    concept: concepts[j],
                    points: []
                });
                continue;
            }
            
            // Create an array to store student point DTOs for this concept
            const studentPointDtos: StudentPointDto[] = [];
            
            // BUILD STUDENT POINT DTOS
            for (let k = 0; k < sectionPoints.length; k++) {
                const point = sectionPoints[k];
                
                // Find the corresponding student point for this point
                const studentPoint = studentPoints.find(sp => sp.point_id === point.point_id);
                
                // If no student point exists for this point, continue to the next point
                if (!studentPoint) {
                    console.log(`No student point found for point ${point.point_id} and student ${student.user_id}`);
                    continue;
                }
                
                const statusId: number = studentPoint.point_status_id;
                let statusName: string = "";
                switch (statusId) {
                    case 1:
                        statusName = "Not Attempted";
                        break;
                    case 2:
                        statusName = "Attempted: Failed";
                        break;
                    case 3:
                        statusName = "Attempted: Needs Revisions";
                        break;
                    case 4:
                        statusName = "Attempted: Passed";
                        break;
                    default:
                        statusName = "Unknown";
                }
            
                const studentPointDto: StudentPointDto = {
                    student_point_id: studentPoint.student_point_id,
                    point_id: point.point_id,
                    topic_id: topics[i].topic_id,
                    concept_id: concepts[j].concept_id,
                    student_id: student.user_id,
                    point_status_id: statusId,
                    point_status_name: statusName,
                    is_test_point: point.is_test_point,
                    date_status_last_updated: studentPoint?.date_status_last_updated ?? null
                };
            
                studentPointDtos.push(studentPointDto);
            }            
                
            
            // Add the concept and its points to conceptsToPoints
            gradeViewData.conceptsToPoints.push({
                concept: concepts[j],
                points: studentPointDtos
            });
            
            // Store the index association for easy lookup
            gradeViewData.indexAssociations.push(j);
        }
    }

    return gradeViewData;
}