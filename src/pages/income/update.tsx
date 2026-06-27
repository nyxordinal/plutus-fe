import useAuth, { ProtectRoute } from "@auth";
import RecordFormLayout from "@component/Forms/RecordFormLayout";
import { TableItem } from "@interface/entity.interface";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { updateIncome } from "@service/income.service";
import { formatDateSimple, useLocalStorage } from "@util";
import { useTranslation } from "locale/translator";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { setIncomeMessage } from "redux/general";
import { useAppDispatch } from "redux/hooks";

const Update = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { translate } = useTranslation();

  const [updateData, setUpdateData] = useLocalStorage<TableItem>(
    "updateDataIncome",
    {
      id: 0,
      name: "",
      type: 0,
      price: 0,
      date: new Date(),
    }
  );

  const clearUpdateData = () => {
    setUpdateData({
      id: 0,
      name: "",
      type: 0,
      price: 0,
      date: new Date(),
    });
  };
  const [source, setSource] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!updateData.id) {
      clearUpdateData();
      router.replace("/income");
      return;
    }

    setSource(updateData.name);
    setAmount(updateData.price);
    setDate(new Date(updateData.date));
  }, [router, updateData.date, updateData.id, updateData.name, updateData.price]);

  useEffect(() => {
    return () => {
      clearUpdateData();
    };
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    const update = async () => {
      const result = await updateIncome({
        id: updateData.id,
        source,
        amount,
        date,
      });
      setIsLoading(false);
      if (result.success) {
        openSnackbar("success", "Update income success");
        clearUpdateData();
        dispatch(setIncomeMessage(result.message));
        router.push("/income");
      } else openSnackbar("error", result.message);
    };
    update();
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
  const handleSourceChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setSource(event.target.value);
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isNaN(parseInt(event.target.value, 10))
      ? setAmount(0)
      : setAmount(parseInt(event.target.value, 10));
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDate(new Date(event.target.value));

  return (
    <RecordFormLayout
      isAuthenticated={isAuthenticated}
      navTitle={translate("updateIncome")}
      navUrl="/income/update"
      submitLabel={translate("updateIncome")}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      open={open}
      message={msg}
      severity={severity}
      onHandleClose={handleClose}
    >
      <div className="w-full px-4 mb-3">
        <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
          {translate("source")}
        </h6>
        <textarea
          className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full min-h-[88px] resize-y"
          value={source}
          onChange={handleSourceChange}
          rows={2}
        />
      </div>
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2 px-4 mb-3">
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
        <div className="w-full md:w-1/2 px-4 mb-3">
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
      </div>
    </RecordFormLayout>
  );
};

export default ProtectRoute(Update);
