import useAuth, { ProtectRoute } from '@auth';
import Layout from '@components/layout';
import Loader from '@components/loader';
import { Summary } from '@interface/entity.interface';
import { CircularProgress, makeStyles, Paper, Typography } from '@material-ui/core';
import { getExpenseSummary } from '@services/expense.service';
import { getIncomeSummary } from '@services/income.service';
import { formatDateShort } from '@util';
import MaterialTable, { Column } from 'material-table';
import { Fragment, useEffect, useState } from 'react';

const useStyles = makeStyles({
  box: {
    marginBottom: '20px'
  }
})

const columnExpense: Column<Summary>[] = [
  {
    title: 'Year Month',
    field: 'yearmonth',
    type: 'date',
    render: rowData => formatDateShort(rowData.yearmonth)
  },
  {
    title: 'Price',
    field: 'amount',
    type: 'numeric',
  },
]

const columnIncome: Column<Summary>[] = [
  {
    title: 'Year Month',
    field: 'yearmonth',
    type: 'date',
    render: rowData => formatDateShort(rowData.yearmonth)
  },
  {
    title: 'Amount',
    field: 'amount',
    type: 'numeric',
  },
]

const IndexPage = () => {
  const { isAuthenticated } = useAuth()
  const classes = useStyles()
  const [expenseSummary, setExpenseSummary] = useState<Summary[]>([])
  const [incomeSummary, setIncomeSummary] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const expensesData = await getExpenseSummary()
      const incomesData = await getIncomeSummary()
      setExpenseSummary(expensesData)
      setIncomeSummary(incomesData)
      setLoading(false)
    }
    if (isAuthenticated) fetchData()
  }, [isAuthenticated]);

  return !isAuthenticated ? (
    <Loader />
  ) : (
    <Layout>
      <Fragment>
        <Typography variant="h4" gutterBottom>Summary Page</Typography>
        <div className={classes.box}>
          <Typography variant="h5" gutterBottom>Expense Summary</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <MaterialTable
              title=""
              columns={columnExpense}
              components={{
                Container: (props) => (
                  <Paper {...props} elevation={0} />
                )
              }}
              data={expenseSummary}
              options={{
                search: true,
                actionsColumnIndex: -1,
                addRowPosition: 'first',
              }}
            />
          )}
        </div>
        <div className={classes.box}>
          <Typography variant="h5" gutterBottom>Income Summary</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <MaterialTable
              title=""
              columns={columnIncome}
              components={{
                Container: (props) => (
                  <Paper {...props} elevation={0} />
                )
              }}
              data={incomeSummary}
              options={{
                search: true,
                actionsColumnIndex: -1,
                addRowPosition: 'first',
              }}
            />
          )}
        </div>
      </Fragment>
    </Layout>
  );
}

export default ProtectRoute(IndexPage)