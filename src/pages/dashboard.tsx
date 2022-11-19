import useAuth, { ProtectRoute } from "@auth";
import CardLineChartSummary from "@component/Cards/CardLineSummary";
import CardPageSummary from "@component/Cards/CardPageSummary";
import Loader from "@component/Loader/Loader";
import AdminDashboard from "@layout/AdminDashboard";
import { getExpenseSummary } from "@service/expense.service";
import { getIncomeSummary } from "@service/income.service";
import { useEffect, useState } from "react";
import { getExpenseSummaryState, setExpenseSummary } from "redux/expense";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { getIncomeSummaryState, setIncomeSummary } from "redux/income";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const expenseSummary = useAppSelector(getExpenseSummaryState).map((o) => ({
    ...o,
  }));
  const incomeSummary = useAppSelector(getIncomeSummaryState).map((o) => ({
    ...o,
  }));
  const [loading, setLoading] = useState(true);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [expenseAvg, setExpenseAvg] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [incomeAvg, setIncomeAvg] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const expensesData = await getExpenseSummary();
      const incomesData = await getIncomeSummary();
      dispatch(setExpenseSummary(expensesData.data));
      dispatch(setIncomeSummary(incomesData.data));
      setExpenseTotal(expensesData.total);
      setExpenseAvg(expensesData.average);
      setIncomeTotal(incomesData.total);
      setIncomeAvg(incomesData.average);
      setLoading(false);
    };
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  return !isAuthenticated ? (
    <Loader />
  ) : (
    <AdminDashboard
      expenseTotal={expenseTotal}
      expenseAverage={expenseAvg}
      incomeTotal={incomeTotal}
      incomeAverage={incomeAvg}
    >
      <>
        {loading ? (
          <Loader isFullHeightScreen={false} />
        ) : (
          <div className="flex flex-wrap">
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
              <CardLineChartSummary
                id={"expense-chart"}
                title="Expense"
                data={expenseSummary}
              />
            </div>
            <div className="w-full xl:w-6/12 px-4">
              <CardLineChartSummary
                id={"income-chart"}
                title="Income"
                data={incomeSummary}
              />
            </div>
          </div>
        )}
        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
            <CardPageSummary
              title="Expense Summary"
              seeAllUrl="/expense"
              data={expenseSummary}
            />
          </div>
          <div className="w-full xl:w-6/12 px-4">
            <CardPageSummary
              title="Income Summary"
              seeAllUrl="/income"
              data={incomeSummary}
            />
          </div>
        </div>
      </>
    </AdminDashboard>
  );
};

export default ProtectRoute(Dashboard);
