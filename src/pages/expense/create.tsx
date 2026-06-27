import useAuth, { ProtectRoute } from "@auth";
import RecordFormLayout from "@component/Forms/RecordFormLayout";
import { EXPENSE_TYPE } from "@interface/enum";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { createExpense } from "@service/expense.service";
import { enumToArray, formatDateSimple } from "@util";
import { useTranslation } from "locale/translator";
import { useRouter } from "next/router";
import { useState } from "react";
import { setExpenseMessage } from "redux/general";
import { useAppDispatch } from "redux/hooks";

const expenseType = enumToArray(EXPENSE_TYPE);

const Create = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { translate } = useTranslation();

  const [name, setName] = useState<string>("");
  const [type, setType] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setName(event.target.value);
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setType(parseInt(event.target.value, 10));
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isNaN(parseInt(event.target.value, 10))
      ? setPrice(0)
      : setPrice(parseInt(event.target.value, 10));
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDate(new Date(event.target.value));
  const handleSubmit = () => {
    setIsLoading(true);
    const create = async () => {
      const result = await createExpense({
        name,
        type,
        price,
        date: formatDateSimple(date),
      });
      setIsLoading(false);
      if (result.success) {
        dispatch(setExpenseMessage(result.message));
        router.push("/expense");
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
      navTitle={translate("createExpense")}
      navUrl="/expense/create"
      submitLabel={translate("createExpense")}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      open={open}
      message={msg}
      severity={severity}
      onHandleClose={handleClose}
    >
      <div className="w-full px-4 mb-3">
        <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
          {translate("name")}
        </h6>
        <textarea
          className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full min-h-[88px] resize-y"
          value={name}
          onChange={handleNameChange}
          rows={2}
        />
      </div>
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2 px-4 mb-3">
          <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
            {translate("expenseType")}
          </h6>
          <select
            className="px-3 py-3 text-blueGray-600 relative bg-white rounded text-sm w-full"
            name="expense-type"
            value={type}
            onChange={handleTypeChange}
          >
            {expenseType.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/2 px-4 mb-3">
          <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
            {translate("expenseDate")}
          </h6>
          <input
            className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
            type="date"
            value={formatDateSimple(date)}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className="w-full px-4 mb-8">
        <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
          {translate("price")}
        </h6>
        <input
          className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
          type="number"
          value={price.toString()}
          onChange={handlePriceChange}
        />
      </div>
    </RecordFormLayout>
  );
};

export default ProtectRoute(Create);
