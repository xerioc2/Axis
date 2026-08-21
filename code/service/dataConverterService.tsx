import { StudentPointDto, SectionPreviewDto, Course, Section, Semester, TeacherDataDto, User, GradeViewDto } from '../../App';
import { getConceptsByTopicIds, getPointsForSection, getStudentPointsForStudent, getTopicsByCourseId } from './supabaseService';
import pointStatusMap, { PointStatusId } from '../utils/pointStatusMap';


 //map sections to their corresponding courses/semesters
 export function compileSectionPreviews(sections: Section[], courses: Course[], semesters: Semester[]){
    const coursesById = new Map(courses.map(course => [course.course_id, course]));
    const semestersById = new Map(semesters.map(semester => [semester.semester_id, semester]));

    return sections.flatMap((section): SectionPreviewDto[] => {
        const course = coursesById.get(section.course_id);
        const semester = semestersById.get(section.semester_id);
        if (!course || !semester) {
            console.warn(`Skipping section ${section.section_id}: related course or semester is missing`);
            return [];
        }
        return [{
            section_id: section.section_id,
            section_identifier: section.section_identifier,
            enrollment_code: section.enrollment_code,
            course_id: section.course_id,
            course_name: course.course_name,
            course_identifier: course.course_identifier,
            course_subject: course.course_subject,
            season: semester.season,
            year: semester.year
        }];
    });
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
export async function compileGradeViewData(_user: User, sectionPreview: SectionPreviewDto, student: User) {
    const topics = await getTopicsByCourseId(sectionPreview.course_id);
    if (!topics) return null;

    const concepts = await getConceptsByTopicIds(topics.map(topic => topic.topic_id));
    const points = await getPointsForSection(sectionPreview.section_id);
    if (!concepts || !points) return null;

    const studentPoints = await getStudentPointsForStudent(
        student.user_id,
        points.map(point => point.point_id)
    );
    if (!studentPoints) return null;

    const conceptsByTopic = new Map<number, typeof concepts>();
    for (const concept of concepts) {
        const group = conceptsByTopic.get(concept.topic_id) ?? [];
        group.push(concept);
        conceptsByTopic.set(concept.topic_id, group);
    }
    const pointsByConcept = new Map<number, typeof points>();
    for (const point of points) {
        const group = pointsByConcept.get(point.concept_id) ?? [];
        group.push(point);
        pointsByConcept.set(point.concept_id, group);
    }
    const studentPointByPointId = new Map(studentPoints.map(point => [point.point_id, point]));

    const gradeViewData: GradeViewDto = {
        topicsToConcepts: topics.map(topic => ({
            topic,
            concepts: conceptsByTopic.get(topic.topic_id) ?? []
        })),
        conceptsToPoints: concepts.map(concept => ({
            concept,
            points: (pointsByConcept.get(concept.concept_id) ?? []).flatMap((point): StudentPointDto[] => {
                const studentPoint = studentPointByPointId.get(point.point_id);
                if (!studentPoint) return [];
                const statusId = studentPoint.point_status_id as PointStatusId;
                return [{
                    student_point_id: studentPoint.student_point_id,
                    point_id: point.point_id,
                    topic_id: concept.topic_id,
                    concept_id: concept.concept_id,
                    student_id: student.user_id,
                    point_status_id: studentPoint.point_status_id,
                    point_status_name: pointStatusMap[statusId] ?? "Unknown",
                    is_test_point: point.is_test_point,
                    date_status_last_updated: studentPoint.date_status_last_updated ?? null
                }];
            })
        })),
        indexAssociations: concepts.map((_, index) => index)
    };

    return gradeViewData;
}
