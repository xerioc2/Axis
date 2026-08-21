/**
 * Maps point status IDs to their descriptive text
 * 
 * Status definitions:
 * 1 - Not Attempted: Student has not yet attempted this point
 * 2 - Attempted: Failed: Student has attempted but did not meet criteria
 * 3 - Attempted: Needs Revisions: Student has attempted and is close, but needs to revise
 * 4 - Attempted: Passed: Student has successfully completed this point
 */

export enum PointStatusId {
    NotAttempted = 1,
    Failed = 2,
    NeedsRevisions = 3,
    Passed = 4
  }
  
  export type PointStatusMap = {
    [key in PointStatusId]: string;
  };
  
  const pointStatusMap: PointStatusMap = {
    [PointStatusId.NotAttempted]: "Not Attempted",
    [PointStatusId.Failed]: "Attempted: Failed",
    [PointStatusId.NeedsRevisions]: "Attempted: Needs Revisions",
    [PointStatusId.Passed]: "Attempted: Passed"
  };
  
  export default pointStatusMap;