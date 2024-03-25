import { List } from "@mui/material";
import { AssignmentNews } from "./store/slices/courses";
import { AssignmentLink } from "./AssignmentLink";

interface IProps {
  courseId: string;
  folders: AssignmentNews[];
}

export const AssignmentList = ({ courseId, folders }: IProps) => {
  return (
    <List>
      {folders.map((f) => (
        <AssignmentLink key={f.folderId} courseId={courseId} folder={f} />
      ))}
    </List>
  );
};
