import { IconButton, Link, List, ListItem, Typography } from "@mui/material";
import { AssignmentNews } from "./store/slices/courses";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";

interface IProps {
  courseId: string;
  folders: AssignmentNews[];
}

export const AssignmentList = ({ courseId, folders }: IProps) => {
  const [graded, setGraded] = useState(false);
  const onGraded = (folder: AssignmentNews) => () =>
    browser.storage.sync
      .set({ [`${courseId}/${folder.folderId}`]: folder.total })
      .then(() => setGraded(true));
  return (
    <>
      {graded && <></>}
      {!graded && (
        <List>
          {folders.map((f) => (
            <ListItem>
              <IconButton onClick={onGraded(f)}>
                <CheckCircleIcon />
              </IconButton>
              <Link
                sx={{ display: "flex", justifyContent: "space-between" }}
                href={`https://brightspace.algonquincollege.com/d2l/lms/dropbox/admin/folders_manage.d2l?ou=${courseId}`}
              >
                <Typography sx={{ textOverflow: "ellipsis" }}>
                  {f.name} ({f.new})
                </Typography>
              </Link>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};
