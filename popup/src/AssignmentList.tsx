import { Link, List, ListItem, Typography } from "@mui/material";
import { AssignmentNews } from "./store/slices/courses";

interface IProps {
  courseId: string;
  folders: AssignmentNews[];
}

export const AssignmentList = ({ courseId, folders }: IProps) => {
  return (
    <List>
      {folders.map((f) => (
        <ListItem>
          <Link
            sx={{ display: "flex", justifyContent: "space-between" }}
            href={`https://brightspace.algonquincollege.com/d2l/lms/dropbox/admin/folders_manage.d2l?ou=${courseId}`}
          >
            <Typography sx={{ textOverflow: "ellipsis" }}>
              {f.name} ({f.amount})
            </Typography>
          </Link>
        </ListItem>
      ))}
    </List>
  );
};
