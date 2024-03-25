import { Box, CircularProgress } from "@mui/material";
import { State, useBrightspaceToken } from "./brightspace-token";
import App from "./App";
import { NoToken } from "./NoToken";

export const Loading = () => {
  const token = useBrightspaceToken();
  return (
    <Box sx={{ width: "100%" }}>
      {token.state === State.LOADING && (
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
      {token.state === State.ERROR && (
        <NoToken error={token.error ?? "UNKNOWN ERROR"} />
      )}
      {token.state === State.OK && <App />}
    </Box>
  );
};
