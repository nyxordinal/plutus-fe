import useAuth, { ProtectRoute } from "@auth";
import CardTableCustom from "@component/Cards/CardTableCustom";
import FooterAdmin from "@component/Footers/FooterAdmin";
import Loader from "@component/Loader/Loader";
import SearchBar from "@component/SearchBar/SearchBar";
import SnackbarAlert from "@component/SnackbarAlert/SnackbarAlert";
import {
  DEFAULT_EXPENSE_SEARCH_VALUES_NAME,
  TABLE_ROW_PER_PAGE_OPTION,
} from "@interface/constant";
import { GetAllExpenseServiceInterface } from "@interface/dto.interface";
import Admin from "@layout/Admin";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { deleteBulkExpense, getAllExpenses } from "@service/expense.service";
import { useEffect, useState } from "react";
import { getExpenseState, setExpense } from "redux/expense";
import { useAppDispatch, useAppSelector } from "redux/hooks";

const ExpensePage = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(getExpenseState);

  const [totalData, setTotalData] = useState<number>(0);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [name, setName] = useState<string>(DEFAULT_EXPENSE_SEARCH_VALUES_NAME);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    TABLE_ROW_PER_PAGE_OPTION[1]
  );
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [filterChanged, setFilterChanged] = useState<boolean>(false);

  const fetchData = async (
    page: number,
    name?: string,
    startDate?: Date,
    endDate?: Date
  ) => {
    setLoadingData(true);
    const param: GetAllExpenseServiceInterface = {
      page,
      dataPerPage: rowsPerPage,
    };
    if (name) {
      param.name = name;
    }
    if (startDate !== undefined && endDate !== undefined) {
      param.startDate = startDate;
      param.endDate = endDate;
    }
    const { expenseData, totalData } = await getAllExpenses(param);
    if (expenseData.length < 1 && totalData === 0 && page > 0) {
      setPage(0);
    }
    dispatch(setExpense(expenseData));
    setTotalData(totalData);
    setLoadingData(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(page + 1, name, startDate, endDate);
    }
  }, [isAuthenticated, rowsPerPage]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterChanged(true);
    setName(event.target.value);
  };
  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterChanged(true);
    setStartDate(new Date(event.target.value));
  };
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterChanged(true);
    setEndDate(new Date(event.target.value));
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    fetchData(newPage + 1, name, startDate, endDate);
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleDeleteClick = async (rowIds: number[]) => {
    const result = await deleteBulkExpense(rowIds);
    if (result.success) {
      await fetchData(1, name, startDate, endDate);
      openSnackbar("success", "Delete expenses success");
    } else openSnackbar("error", `Delete expenses failed, ${result.message}`);
  };
  const handleApplyFilter = () => {
    setPage(0);
    fetchData(page, name, startDate, endDate);
    setFilterChanged(false);
  };
  const handleClearFilter = () => {
    setFilterChanged(false);
    setPage(0);
    setName("");
    setStartDate(undefined);
    setEndDate(undefined);
    fetchData(1);
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
    <Admin name="Expense" customUrl="/expense">
      <>
        <SnackbarAlert
          open={open}
          message={msg}
          severity={severity}
          onHandleClose={handleClose}
        />
        <SearchBar
          name={name}
          startDate={startDate}
          endDate={endDate}
          isFilterChanged={filterChanged}
          onNameChange={handleNameChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onApplyFilter={handleApplyFilter}
          onClearFilter={handleClearFilter}
        />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
              <CardTableCustom
                name={"Expense"}
                loadingTable={loadingData}
                createPageUrl={"/expense/create"}
                updatePageUrl={"/expense/update"}
                totalData={totalData}
                page={page}
                rowsPerPage={rowsPerPage}
                updateDataKey="updateDataExpense"
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleDeleteClick={handleDeleteClick}
                items={expenses}
              />
            </div>
          </div>
          <FooterAdmin />
        </div>
      </>
    </Admin>
  );
};

export default ProtectRoute(ExpensePage);
