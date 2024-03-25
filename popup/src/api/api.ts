import { makeFetch, makeQuery } from "./utils";

export interface WhoAmI {
  Identifier: string;
  FirstName: string;
  LastName: string;
  UniqueName: string;
  ProfileIdentifier: string;
}

const lpVersion = "1.9";
const leVersion = "1.74";

// API def
// https://docs.valence.desire2learn.com/http-routingtable.html
//            https://d52a5d1e-ab94-4159-bbef-ace0093616dc.activities.api.brightspace.com/
//            old/activities/6606_2000_575368/usages/621196/evaluation-status

const host = `https://d52a5d1e-ab94-4159-bbef-ace0093616dc.organizations.api.brightspace.com`;
const lpBase = `/d2l/api/lp/${lpVersion}`;
const lpBaseURL = host + lpBase;

const leBase = `/d2l/api/le/${leVersion}`;
const leBaseURL = host + leBase;

export const useWhoAmIQuery = makeQuery<WhoAmI, void>(
  lpBaseURL,
  () => `/users/whoami`
);

export const fetchWhoAmI = makeFetch<WhoAmI, void>(
  lpBaseURL,
  () => `/users/whoami`
);

export interface Folder {
  Id: number;
  CategoryId: unknown;
  Name: string;
  TotalFiles: number;
  UnreadFiles: number;
  FlaggedFiles: number;
  TotalUsers: number;
  TotalUsersWithSubmissions: number;
  TotalUsersWithFeedback: number;
  IsHidden: boolean;
  AllowTextSubmission: boolean;
  DropboxType: number;
  GroupTypeId: unknown;
  DueDate: string;
  DisplayInCalendar: boolean;
  NotificationEmail: unknown;
  LinkAttachments: unknown[];
  ActivityId: string;
  IsAnonymous: boolean;
  SubmissionType: number;
  CompletionType: number;
  AllowableFileType: number;
  CustomAllowableFileTypes: unknown;
  GradeItemId: number;
  AllowOnlyUsersWithSpecialAccess: boolean;
  CustomInstructions: {
    Text: string;
    Html: string;
  };
  Attachments: {
    FileId: number;
    FileName: string;
    Size: number;
  }[];
  Availability: {
    StartDate: string;
    EndDate: string;
    StartDateAvailabilityType: number;
    EndDateAvailabilityType: number;
  };
  Assessment: unknown;
}

export const useFoldersQuery = makeQuery<Folder[], string>(
  leBaseURL,
  (course: string) => `/${course}/dropbox/folders/`
);

export const fetchFolders = makeFetch<Folder[], string>(
  leBaseURL,
  (course: string) => `/${course}/dropbox/folders/`
);

interface Entity {
  EntityId: number;
  EntityType: "User";
  DisplayName: string;
}

interface Feedback {}

interface Submission {
  Id: number;
  SubmittedBy: {
    Id: string;
    DisplayName: string;
  };
  SubmissionDate: string | null;
  // "Comment": { <composite:RichText> },
  // "Files": [ // Array of File blocks
  //     {
  //         "FileId": <number:D2LID>,
  //         "FileName": <string>,
  //         "Size": <number:long>,
  //         "isRead": <boolean>,
  //         "isFlagged": <boolean>
  //     },
  //     { <composite:File> }, ...
  // ]
}

interface SubmissionSummary {
  Entity: Entity;
  Status: string;
  Feedback: Feedback;
  Submissions: Submission[];
  CompletionDate: string | null;
}

export const fetchSubmissions = makeFetch<
  SubmissionSummary[],
  [string, string]
>(
  leBaseURL,
  ([course, folder]) => `/${course}/dropbox/folders/${folder}/submissions/`
);

export const fetchFeedback = makeFetch<any, [string, string, string]>(
  leBaseURL,
  ([course, folder, user]) =>
    `/${course}/dropbox/folders/${folder}/feedback/user/${user}`
);

export interface Course {
  Identifier: string;
  Name: string;
  Code: string;
  IsActive: boolean;
  CanSelfRegister: boolean;
  Description: {
    Text: string;
    Html: string;
  };
  Path: string;
  StartDate: string;
  EndDate: string;
  CourseTemplate: {
    Identifier: string;
    Name: string;
    Code: string;
  };
  Semester: {
    Identifier: string;
    Name: string;
    Code: string;
  };
  Department: {
    Identifier: string;
    Name: string;
    Code: string;
  };
}

export const useCourseQuery = makeQuery<Course, string>(
  lpBaseURL,
  (course: string) => `/courses/${course}`
);

export const fetchCourse = makeFetch<Course, string>(
  lpBaseURL,
  (course: string) => `/courses/${course}`
);

export interface MyEnrollments {
  PagingInfo: {
    Bookmark: string;
    HasMoreItems: boolean;
  };
  Items: {
    OrgUnit: {
      Id: number;
      Type: {
        Id: number;
        Code: string;
        Name: string;
      };
      Name: string;
      Code: string;
    };
    Access: {
      IsActive: true;
      StartDate: string;
      EndDate: string;
      CanAccess: boolean;
      ClasslistRoleName: string;
      LISRoles: string[];
      LastAccessed: string;
    };
  }[];
}

export const useEnrollmentsQuery = makeQuery<MyEnrollments, void>(
  lpBaseURL,
  () => `/enrollments/myenrollments/`
);

export const fetchEnrollments = makeFetch<MyEnrollments, void>(
  lpBaseURL,
  () => `/enrollments/myenrollments/`
);
