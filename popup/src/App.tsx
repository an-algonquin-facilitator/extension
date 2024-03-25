import { useEffect, useState } from "react";
import { fetchEnrollments, fetchFolders, fetchSubmissions } from "./api/api";
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
          const classes = folders.map((folder) =>
            fetchSubmissions(token, [course.id, folder.Id + ""])
              .then((subs) =>
                subs.reduce((acc, s) => acc + s.Submissions.length, 0)
              )
              .then(async (totalCount) => {
                return browser.storage.sync
                  .get(`${course.id}/${folder.Id}`)
                  .then((v) => {
                    return {
                      name: folder.Name,
                      folderId: folder.Id + "",
                      total: totalCount,
                      new: totalCount - (v[`${course.id}/${folder.Id}`] ?? 0),
                    };
                  });
              })
          );

          Promise.all(classes).then((courseFetches) => {
            const toGrade = courseFetches.filter((f) => f.new);
            setLoading((loading) => ({
              ...loading,
              [course.id]: false,
            }));
            dispatch(
              setAssignments({
                id: course.id,
                assignments: toGrade,
              })
            );
          });
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
        <Box
          sx={{
            m: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
