import useAuth, { ProtectRoute } from '@auth';
import ExpenseTable from '@components/ExpenseTable';
import Layout from '@components/layout';
import Loader from '@components/loader';
import { DEFAULT_EXPENSE_SEARCH_VALUES_NAME, SEARCH_TGL_BUTTON_OFF_TEXT, SEARCH_TGL_BUTTON_ON_TEXT, TABLE_ROW_PER_PAGE_OPTION } from '@interface/constant';
import { Button, PropTypes } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { getAllExpenses } from '@services/expense.service';
import { formatDateSimple } from '@util';
import { Fragment, useEffect, useState } from 'react';
import { getExpenseState, setExpense } from 'redux/expense';
import { getExpenseMsgState } from 'redux/general';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

const useStyles = makeStyles({
    searchForm: {
        marginBottom: '16px'
    },
    seachToggleButton: {
        marginBottom: '16px'
    }
})
const ExpensePage = () => {
    const { isAuthenticated } = useAuth()
    const classes = useStyles()

    const dispatch = useAppDispatch()
    const expenses = useAppSelector(getExpenseState)
    const updateAlertMsg = useAppSelector(getExpenseMsgState)

    const [totalData, setTotalData] = useState<number>(0);
    const [loadingPage, setLoadingPage] = useState<boolean>(true)
    const [loadingData, setLoadingData] = useState<boolean>(true)
    const [name, setName] = useState<string>(DEFAULT_EXPENSE_SEARCH_VALUES_NAME);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(TABLE_ROW_PER_PAGE_OPTION[1]);
    const [searchMode, setSearchMode] = useState<boolean>(false);
    const [tglBtnColor, setTglBtnColor] = useState<PropTypes.Color>('primary');
    const [tglBtnText, setTglBtnText] = useState<string>('Turn On Search');

    const fetchData = async (page: number, name?: string, startDate?: Date, endDate?: Date) => {
        setLoadingData(true)
        const { expenseData, totalData } = await getAllExpenses({ page, dataPerPage: rowsPerPage, name, startDate, endDate })
        if (expenseData.length < 1 && totalData == 0 && page > 0) {
            setPage(0)
        }
        dispatch(setExpense(expenseData))
        setTotalData(totalData)
        setLoadingData(false)
    }

    useEffect(() => {
        if (isAuthenticated) {
            searchMode
                ? fetchData(page + 1, name, startDate, endDate)
                : fetchData(page + 1,)
            if (loadingPage) setLoadingPage(false)
        }
    }, [isAuthenticated, rowsPerPage]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);
    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => setStartDate(new Date(event.target.value));
    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => setEndDate(new Date(event.target.value));
    const handleChangePage = (event: unknown, newPage: number) => {
        searchMode
            ? fetchData(newPage + 1, name, startDate, endDate)
            : fetchData(newPage + 1)
        setPage(newPage)
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleSearchSubmit = () => {
        setPage(0)
        fetchData(page, name, startDate, endDate)
    }
    const handleToggleSearch = () => {
        searchMode ? setTglBtnColor('primary') : setTglBtnColor('default')
        searchMode ? setTglBtnText(SEARCH_TGL_BUTTON_ON_TEXT) : setTglBtnText(SEARCH_TGL_BUTTON_OFF_TEXT)
        setSearchMode(!searchMode)
        setName(DEFAULT_EXPENSE_SEARCH_VALUES_NAME)
        setStartDate(new Date())
        setEndDate(new Date())
    }

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <Layout>
            <Fragment>
                <Typography variant="h4" gutterBottom>Expense Page</Typography>
                <div style={{ height: 800, width: '100%' }}>
                    {loadingPage ? (
                        <CircularProgress />
                    ) : (
                        <Fragment>
                            <form noValidate autoComplete="off" className={classes.searchForm}>
                                <Grid container spacing={2} >
                                    <Grid item lg={3} sm={12} >
                                        <TextField
                                            id="name"
                                            label="Name"
                                            variant="outlined"
                                            value={name}
                                            onChange={handleNameChange}
                                            fullWidth
                                            disabled={!searchMode}
                                        />
                                    </Grid>
                                    <Grid item lg={2} sm={12}>
                                        <TextField
                                            id="start-date"
                                            label="Start Date"
                                            variant="outlined"
                                            type="date"
                                            value={formatDateSimple(startDate)}
                                            onChange={handleStartDateChange}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled={!searchMode}
                                        >
                                        </TextField>
                                    </Grid>
                                    <Grid item lg={2} sm={12}>
                                        <TextField
                                            id="end-date"
                                            label="End Date"
                                            variant="outlined"
                                            type="date"
                                            value={formatDateSimple(endDate)}
                                            onChange={handleEndDateChange}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled={!searchMode}
                                        />
                                    </Grid>
                                    <Grid item lg={2} sm={12}>
                                        <Button
                                            onClick={handleSearchSubmit}
                                            variant="contained"
                                            size="medium"
                                            color="primary"
                                            disabled={!searchMode}
                                        >Search Expense</Button>
                                    </Grid>
                                </Grid>
                            </form>
                            <Button
                                onClick={handleToggleSearch}
                                variant="contained"
                                size="medium"
                                color={tglBtnColor}
                                className={classes.seachToggleButton}
                            >{tglBtnText}</Button>
                            <ExpenseTable
                                updateAlertMsg={updateAlertMsg}
                                totalData={totalData}
                                expenses={expenses}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                loadingData={loadingData}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                                handleRefreshData={fetchData}
                            />
                        </Fragment>
                    )}
                </div>
            </Fragment>
        </Layout>
    );
}

export default ProtectRoute(ExpensePage)