import { Box, Link, Typography } from "@mui/material";

interface IProps {
  error: string;
}

export const NoToken = ({ error }: IProps) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography>{error}</Typography>
      <Typography>
        Visit{" "}
        <Link href="https://brightspace.algonquincollege.com/">
          brightspace
        </Link>{" "}
        to acquire a new one.
      </Typography>
    </Box>
  );
};
