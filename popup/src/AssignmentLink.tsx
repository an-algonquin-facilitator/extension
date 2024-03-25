import { IconButton, Link, ListItem, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AssignmentNews } from "./store/slices/courses";
import { useState } from "react";

interface IProps {
  courseId: string;
  folder: AssignmentNews;
}

export const AssignmentLink = ({ courseId, folder }: IProps) => {
  const [graded, setGraded] = useState(false);
  const onGraded = () =>
    browser.storage.sync
      .set({ [`${courseId}/${folder.folderId}`]: folder.total })
      .then(() => setGraded(true));

  return (
    <>
      {graded && <></>}
      {!graded && (
        <ListItem>
          <IconButton onClick={onGraded}>
            <CheckCircleIcon />
          </IconButton>
          <Link
            sx={{ display: "flex", justifyContent: "space-between" }}
            href={`https://brightspace.algonquincollege.com/d2l/lms/dropbox/admin/folders_manage.d2l?ou=${courseId}`}
          >
            <Typography sx={{ textOverflow: "ellipsis" }}>
              {folder.name} ({folder.new})
            </Typography>
          </Link>
        </ListItem>
      )}
    </>
  );
};
