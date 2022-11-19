import useAuth, { ProtectRoute } from "@auth";
import CardProfile from "@component/Cards/CardProfile";
import CardSettings from "@component/Cards/CardSettings";
import FooterAdmin from "@component/Footers/FooterAdmin";
import Loader from "@component/Loader/Loader";
import SnackbarAlert from "@component/SnackbarAlert/SnackbarAlert";
import Admin from "@layout/Admin";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { getAllSettings, updateSettings } from "@service/setting.service";
import { useEffect, useState } from "react";

const Setting = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [expenseLimit, setExpenseLimit] = useState<string>("0");
  const [lastNotifDate, setLastNotifDate] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const fetchData = async () => {
    setLoadingPage(true);
    const { expenseLimit, lastNotifDate } = await getAllSettings();
    setExpenseLimit(expenseLimit.toString());
    setLastNotifDate(lastNotifDate);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      if (loadingPage) setLoadingPage(false);
    }
  }, [isAuthenticated]);

  const handleExpenseLimitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setExpenseLimit(parseFloat(event.target.value).toFixed(2));
  const handleSaveExpenseLimit = () => {
    const update = async () => {
      const result = await updateSettings({
        expenseLimit: parseFloat(expenseLimit),
        isResetNotif: false,
      });
      if (result.success) openSnackbar("success", result.message);
      else openSnackbar("error", result.message);
    };
    update();
  };
  const handleResetNotification = () => {
    const resetNotif = async () => {
      const result = await updateSettings({
        expenseLimit: parseFloat(expenseLimit),
        isResetNotif: true,
      });
      if (result.success)
        openSnackbar("success", "Notification reset successful");
      else openSnackbar("error", result.message);
    };
    resetNotif();
  };

  const handleClose = (
    event: React.SyntheticEvent<any> | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const openSnackbar = (type: AlertColor, message: string) => {
    setMessage(message);
    setSeverity(type);
    setOpen(true);
  };

  return !isAuthenticated ? (
    <Loader />
  ) : (
    <Admin name="Setting" customUrl="/expense">
      <>
        <SnackbarAlert
          open={open}
          message={msg}
          severity={severity}
          onHandleClose={handleClose}
        />
        <div className="relative bg-blueGray-800 md:pt-32 pb-16 pt-16" />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-8/12 px-4">
              <CardSettings
                user={user}
                expenseLimit={expenseLimit}
                lastNotifDate={lastNotifDate}
                onChangeExpenseLimit={handleExpenseLimitChange}
                saveExpenseLimit={handleSaveExpenseLimit}
                resetNotification={handleResetNotification}
              />
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <CardProfile name={user.name} logout={logout} />
            </div>
          </div>
          <FooterAdmin />
        </div>
      </>
    </Admin>
  );
};

export default ProtectRoute(Setting);
