import { useEffect, useState } from "react";
import { fetchEnrollments, fetchFolders } from "./api/api";
import { useDispatch, useSelector } from "react-redux";
import { setAssignments, setCourses } from "./store/slices/courses";
import { RootState } from "./store/store";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Course } from "./Course";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const useLoadCourseNews = () => {
  const [loading, setLoading] = useState({ course: true });
  const token = useSelector((state: RootState) => state.token.value);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchEnrollments(token).then((courses) => {
      const loadedCourses = courses.Items.filter(
        (e) =>
          e.Access.ClasslistRoleName === "Facilitator" &&
          e.OrgUnit.Type.Code === "Course Offering"
      ).map((course) => ({
        id: course.OrgUnit.Id + "",
        name: course.OrgUnit.Name,
        assignments: [],
      }));
      dispatch(setCourses(loadedCourses));

      setLoading({
        course: false,
        ...Object.fromEntries(loadedCourses.map((c) => [c.id, true])),
      });

      loadedCourses.forEach((course) => {
        fetchFolders(token, course.id).then((folders) => {
          console.log(folders);
          const toGrade = folders.filter(
            (f) => f.TotalUsersWithSubmissions - f.TotalUsersWithFeedback > 0
          );
          console.log(folders);

          setLoading((loading) => ({
            ...loading,
            [course.id]: false,
          }));
          dispatch(
            setAssignments({
              id: course.id,
              assignments: toGrade.map((f) => ({
                name: f.Name,
                amount: f.TotalUsersWithSubmissions - f.TotalUsersWithFeedback,
              })),
            })
          );
        });
      });
    });
  }, [dispatch, token]);

  return !Object.entries(loading).some(([_, loaded]) => loaded);
};

function secondsToHms(d: number) {
  const m = Math.floor((d % 3600000) / 60000);
  const s = Math.floor((d % 60000) / 1000);
  return `${m}m ${s}s`;
}

const TimeLeft = () => {
  const expiry = useSelector((state: RootState) => state.token.expires);
  const [timeLeft, setTimeLeft] = useState("???");

  useEffect(() => {
    const updateTimeLeft = () => {
      const expiryDate = new Date(expiry);
      const untilExpiry = expiryDate.getTime() - Date.now();
      setTimeLeft(secondsToHms(untilExpiry));
    };
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [expiry]);

  return <Typography>Token expires in: {timeLeft}</Typography>;
};

const App = () => {
  const loaded = useLoadCourseNews();
  const courses = useSelector((state: RootState) => state.courses);
  const news = courses.courses.filter((c) => c.assignments.length > 0);

  return (
    <>
      {!loaded && (
        <Box sx={{ m: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {loaded &&
        news.length > 0 &&
        news.map((course) => <Course course={course} />)}
      {loaded && news.length === 0 && (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CheckCircleOutlineOutlinedIcon sx={{ color: "#00703c" }} />
            <Typography sx={{ px: 1 }}>All caught up!</Typography>
          </Box>
        </Box>
      )}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TimeLeft />
      </Box>
    </>
  );
};

export default App;
