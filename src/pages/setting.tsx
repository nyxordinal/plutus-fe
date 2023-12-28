import useAuth, { ProtectRoute } from "@auth";
import CardProfile from "@component/Cards/CardProfile";
import CardSettings from "@component/Cards/CardSettings";
import FooterAdmin from "@component/Footers/FooterAdmin";
import Loader from "@component/Loader/Loader";
import SnackbarAlert from "@component/SnackbarAlert/SnackbarAlert";
import { User } from "@interface/entity.interface";
import Admin from "@layout/Admin";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { getUserCookie, setUserCookie } from "@service/cookie.service";
import { getAllSettings, updateSettings } from "@service/setting.service";
import { useCurrency } from "currency";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Setting = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { updateCurrency: setCurrency } = useCurrency();
  const router = useRouter();

  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [expenseLimit, setExpenseLimit] = useState<string>("0");
  const [lastNotifDate, setLastNotifDate] = useState<string>("");
  const [currencyInput, setCurrencyInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const fetchData = async () => {
    setLoadingPage(true);
    const { expenseLimit, lastNotifDate, currency } = await getAllSettings();
    setExpenseLimit(expenseLimit.toString());
    setLastNotifDate(lastNotifDate);
    setCurrencyInput(currency);
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
  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrencyInput(event.target.value);
    const update = async () => {
      const result = await updateSettings({
        expenseLimit: parseFloat(expenseLimit),
        isResetNotif: false,
        currency: event.target.value,
      });
      if (result.success) {
        openSnackbar(
          "success",
          "Currency updated, page will automatically refresh"
        );
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else openSnackbar("error", result.message);
    };
    update();
    setCurrency(event.target.value);
    const userDataString = getUserCookie();
    if (userDataString) {
      const user: User = JSON.parse(userDataString);
      user.currency = event.target.value;
      setUserCookie(user);
    }
  };
  const handleSaveExpenseLimit = () => {
    const update = async () => {
      const result = await updateSettings({
        expenseLimit: parseFloat(expenseLimit),
        isResetNotif: false,
        currency: currencyInput,
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
        currency: currencyInput,
      });
      if (result.success)
        openSnackbar("success", "Notification reset successful");
      else openSnackbar("error", result.message);
    };
    resetNotif();
  };
  const handleEnglishLocale = () => {
    router.push("/setting", "/setting", { locale: "en" });
  };
  const handleBahasaLocale = () => {
    router.push("/setting", "/setting", { locale: "id" });
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
                currency={currencyInput}
                onChangeExpenseLimit={handleExpenseLimitChange}
                onChangeCurrency={handleCurrencyChange}
                saveExpenseLimit={handleSaveExpenseLimit}
                resetNotification={handleResetNotification}
                onEnglishLocaleClick={handleEnglishLocale}
                onBahasaLocaleClick={handleBahasaLocale}
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
