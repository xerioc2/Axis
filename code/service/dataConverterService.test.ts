import type { Concept, Course, Point, Section, Semester, StudentPoint, Topic, User } from "../../App";
import { describe, expect, it, jest } from "@jest/globals";
import {
  getConceptsByTopicIds,
  getPointsForSection,
  getStudentPointsForStudent,
  getTopicsByCourseId,
} from "./supabaseService";
import { compileGradeViewData, compileSectionPreviews } from "./dataConverterService";

jest.mock("./supabaseService", () => ({
  getConceptsByTopicIds: jest.fn(),
  getPointsForSection: jest.fn(),
  getStudentPointsForStudent: jest.fn(),
  getTopicsByCourseId: jest.fn(),
}));

const mockedTopics = jest.mocked(getTopicsByCourseId);
const mockedConcepts = jest.mocked(getConceptsByTopicIds);
const mockedPoints = jest.mocked(getPointsForSection);
const mockedStudentPoints = jest.mocked(getStudentPointsForStudent);

const user: User = {
  user_id: "student-1",
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
  school_id: 1,
  user_type_id: 1,
};

describe("compileSectionPreviews", () => {
  it("maps related records and skips sections with missing relations", () => {
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const sections: Section[] = [
      { section_id: 1, section_identifier: "A", enrollment_code: "JOIN", semester_id: 2, course_id: 3, date_created: "", start_date: "" },
      { section_id: 9, section_identifier: "B", enrollment_code: "MISS", semester_id: 2, course_id: 99, date_created: "", start_date: "" },
    ];
    const courses: Course[] = [
      { course_id: 3, course_subject: "CS", course_identifier: "101", course_name: "Computing", creator_id: "teacher", school_id: 1, date_created: "" },
    ];
    const semesters: Semester[] = [{ semester_id: 2, season: "Fall", year: 2026 }];

    expect(compileSectionPreviews(sections, courses, semesters)).toEqual([
      expect.objectContaining({ section_id: 1, course_name: "Computing", season: "Fall" }),
    ]);
  });
});

describe("compileGradeViewData", () => {
  it("loads the grade view in batches and associates only the requested student's points", async () => {
    const topics: Topic[] = [{ topic_id: 10, topic_title: "Basics", topic_description: null, course_id: 3 }];
    const concepts: Concept[] = [{ concept_id: 20, concept_title: "Variables", concept_description: null, topic_id: 10 }];
    const points: Point[] = [{ point_id: 30, is_test_point: false, section_id: 1, concept_id: 20 }];
    const studentPoints: StudentPoint[] = [{ student_point_id: 40, date_status_last_updated: null, student_id: user.user_id, point_id: 30, point_status_id: 4 }];
    mockedTopics.mockResolvedValue(topics);
    mockedConcepts.mockResolvedValue(concepts);
    mockedPoints.mockResolvedValue(points);
    mockedStudentPoints.mockResolvedValue(studentPoints);

    const result = await compileGradeViewData(user, {
      section_id: 1,
      section_identifier: "A",
      enrollment_code: "JOIN",
      season: "Fall",
      year: 2026,
      course_id: 3,
      course_name: "Computing",
      course_identifier: "101",
      course_subject: "CS",
    }, user);

    expect(mockedConcepts).toHaveBeenCalledWith([10]);
    expect(mockedPoints).toHaveBeenCalledWith(1);
    expect(mockedStudentPoints).toHaveBeenCalledWith(user.user_id, [30]);
    expect(result?.conceptsToPoints[0].points[0]).toEqual(expect.objectContaining({
      point_id: 30,
      point_status_name: "Attempted: Passed",
      student_id: user.user_id,
    }));
  });
});
