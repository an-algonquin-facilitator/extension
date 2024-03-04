import { Paper, Typography } from "@mui/material";
import { AssignmentList } from "./AssignmentList";
import { CourseNews } from "./store/slices/courses";

interface IProps {
  course: CourseNews;
}

export const Course = ({ course }: IProps) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography>{course.name}</Typography>
      <AssignmentList courseId={course.id} folders={course.assignments} />
    </Paper>
  );
};
