import useAuth, { ProtectRoute } from "@auth";
import RecordFormLayout from "@component/Forms/RecordFormLayout";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { createIncome } from "@service/income.service";
import { formatDateSimple } from "@util";
import { useTranslation } from "locale/translator";
import { useRouter } from "next/router";
import { useState } from "react";
import { setIncomeMessage } from "redux/general";
import { useAppDispatch } from "redux/hooks";

const Create = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { translate } = useTranslation();

  const [source, setSource] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSource(event.target.value);
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isNaN(parseInt(event.target.value, 10))
      ? setAmount(0)
      : setAmount(parseInt(event.target.value, 10));
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDate(new Date(event.target.value));
  const handleSubmit = () => {
    setIsLoading(true);
    const create = async () => {
      const result = await createIncome({
        source,
        amount,
        date: formatDateSimple(date),
      });
      setIsLoading(false);
      if (result.success) {
        dispatch(setIncomeMessage(result.message));
        router.push("/income");
      } else openSnackbar("error", result.message);
    };
    create();
  };

  const openSnackbar = (type: AlertColor, message: string) => {
    setMessage(message);
    setSeverity(type);
    setOpen(true);
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

  return (
    <RecordFormLayout
      isAuthenticated={isAuthenticated}
      navTitle={translate("createIncome")}
      navUrl="/income/create"
      submitLabel={translate("createIncome")}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      open={open}
      message={msg}
      severity={severity}
      onHandleClose={handleClose}
    >
      <div className="lg:w-6/12 xl:w-3/12 px-4 mb-3">
        <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
          {translate("source")}
        </h6>
        <input
          className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
          type="text"
          value={source}
          onChange={handleSourceChange}
        />
      </div>
      <div className="lg:w-6/12 xl:w-3/12 px-4 mb-3">
        <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
          {translate("amount")}
        </h6>
        <input
          className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
          type="number"
          value={amount.toString()}
          onChange={handleAmountChange}
        />
      </div>
      <div className="lg:w-6/12 xl:w-3/12 px-4 mb-8">
        <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
          {translate("incomeDate")}
        </h6>
        <input
          className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
          type="date"
          value={formatDateSimple(date)}
          onChange={handleDateChange}
        />
      </div>
    </RecordFormLayout>
  );
};
export default ProtectRoute(Create);
