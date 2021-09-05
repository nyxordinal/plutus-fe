import useAuth, { ProtectRoute } from '@auth';
import ExpenseTable from '@components/ExpenseTable';
import Layout from '@components/layout';
import Loader from '@components/loader';
import { DEFAULT_EXPENSE_SEARCH_VALUES, SEARCH_TGL_BUTTON_OFF_TEXT, SEARCH_TGL_BUTTON_ON_TEXT, TABLE_ROW_PER_PAGE_OPTION } from '@interface/constant';
import { Expense } from '@interface/entity.interface';
import { Button, PropTypes } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { getAllExpenses } from '@services/expense.service';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

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
    const router = useRouter()
    const classes = useStyles()

    const [updateAlertMsg, setUpdateAlertMsg] = useState<string>('');
    const [totalData, setTotalData] = useState<number>(0);
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loadingPage, setLoadingPage] = useState<boolean>(true)
    const [loadingData, setLoadingData] = useState<boolean>(true)
    const [name, setName] = useState<string>(DEFAULT_EXPENSE_SEARCH_VALUES.name);
    const [startDate, setStartDate] = useState<Date>(DEFAULT_EXPENSE_SEARCH_VALUES.startDate);
    const [endDate, setEndDate] = useState<Date>(DEFAULT_EXPENSE_SEARCH_VALUES.endDate);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(TABLE_ROW_PER_PAGE_OPTION[0]);
    const [searchMode, setSearchMode] = useState<boolean>(false);
    const [tglBtnColor, setTglBtnColor] = useState<PropTypes.Color>('primary');
    const [tglBtnText, setTglBtnText] = useState<string>('Turn On Search');

    const fetchData = async (page: number, turnOffLoadingData = false, name?: string, startDate?: Date, endDate?: Date) => {
        const { expenseData, totalData } = await getAllExpenses({ page, dataPerPage: rowsPerPage, name, startDate, endDate })
        if (expenseData.length < 1 && totalData == 0 && page > 0) {
            setPage(0)
        }
        setExpenses(expenseData)
        setTotalData(totalData)
        if (turnOffLoadingData) setLoadingData(false)
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchData(page + 1, true)
            if (router.query.msg != undefined && router.query.msg?.length != 0)
                setUpdateAlertMsg(router.query.msg as string)
            setLoadingPage(false)
        }
    }, [isAuthenticated]);

    useEffect(() => {
        setLoadingData(true)
        searchMode
            ? fetchData(page + 1, true, name, startDate, endDate)
            : fetchData(page + 1, true)
    }, [rowsPerPage]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);
    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => setStartDate(new Date(event.target.value));
    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => setEndDate(new Date(event.target.value));
    const handleChangePage = (event: unknown, newPage: number) => {
        setLoadingData(true)
        searchMode
            ? fetchData(newPage + 1, true, name, startDate, endDate)
            : fetchData(newPage + 1, true)
        setPage(newPage)
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleSearchSubmit = () => {
        setPage(0)
        setLoadingData(true)
        fetchData(page, true, name, startDate, endDate)
    }
    const handleToggleSearch = () => {
        searchMode ? setTglBtnColor('primary') : setTglBtnColor('default')
        searchMode ? setTglBtnText(SEARCH_TGL_BUTTON_ON_TEXT) : setTglBtnText(SEARCH_TGL_BUTTON_OFF_TEXT)
        setSearchMode(!searchMode)
        setName(DEFAULT_EXPENSE_SEARCH_VALUES.name)
        setStartDate(DEFAULT_EXPENSE_SEARCH_VALUES.startDate)
        setEndDate(DEFAULT_EXPENSE_SEARCH_VALUES.endDate)
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
                                            value={startDate.toISOString().split('T')[0]}
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
                                            value={endDate.toISOString().split('T')[0]}
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