import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AssignmentNews {
  name: string;
  folderId: string;
  total: number;
  new: number;
}

export interface CourseNews {
  id: string;
  name: string;
  assignments: AssignmentNews[];
}

export interface CoursesState {
  courses: CourseNews[];
}

const initialState: CoursesState = {
  courses: [],
};

export const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<CourseNews[]>) => {
      state.courses = action.payload;
    },
    setAssignments: (
      state,
      action: PayloadAction<{ id: string; assignments: AssignmentNews[] }>
    ) => {
      const course = state.courses.find((c) => c.id === action.payload.id);
      if (course) {
        course.assignments = action.payload.assignments;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCourses, setAssignments } = coursesSlice.actions;

export const coursesReducer = coursesSlice.reducer;
