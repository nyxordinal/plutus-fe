import {
  Alert,
  AlertColor,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";

type PropType = {
  open: boolean;
  message: string;
  severity: AlertColor;
  onHandleClose: (
    event: React.SyntheticEvent<any> | Event,
    reason: SnackbarCloseReason
  ) => void;
};

const SnackbarAlert = ({
  open,
  message,
  severity,
  onHandleClose,
}: PropType) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={3000}
      onClose={onHandleClose}
    >
      <Alert
        onClose={onHandleClose as (event: React.SyntheticEvent) => void}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
