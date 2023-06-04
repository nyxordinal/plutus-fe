import useAuth, { ProtectRoute } from '@auth';
import Layout from '@components/layout';
import Loader from '@components/loader';
import { Button, Divider, Snackbar } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Alert, Color } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { getAllSettings, updateSettings } from '@services/setting.service';
import { Fragment, useEffect, useState } from 'react';

const useStyles = makeStyles({
    settingsForm: {
        marginTop: '32px',
        marginBottom: '32px'
    },
    settingsFormBtn: {
        marginBottom: '32px'
    },
    notificationSetting: {
        marginTop: '32px',
        marginBottom: '16px'
    }
})

const SetttingPage = () => {
    const { isAuthenticated } = useAuth()
    const classes = useStyles()

    const [loadingPage, setLoadingPage] = useState<boolean>(true)
    const [loadingButton, setLoadingButton] = useState<boolean>(false)
    const [loadingNotifButton, setLoadingNotifButton] = useState<boolean>(false)
    const [expenseLimit, setExpenseLimit] = useState<string>('0.00');
    const [lastNotifDate, setLastNotifDate] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Color>('success');

    useEffect(() => {
        if (isAuthenticated) {
            fetchData()
            if (loadingPage) setLoadingPage(false)
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        setLoadingPage(true)
        const { expenseLimit, lastNotifDate } = await getAllSettings()
        setExpenseLimit(expenseLimit.toString())
        setLastNotifDate(lastNotifDate)
    }

    const handleExpenseLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => setExpenseLimit(parseFloat(event.target.value).toFixed(2));
    const handleSubmit = () => {
        const update = async () => {
            const result = await updateSettings({
                expenseLimit: parseFloat(expenseLimit),
                isResetNotif: false
            })
            if (result.success) openSnackbar('success', result.message)
            else openSnackbar('error', result.message)
        }
        setLoadingButton(true)
        update()
        setLoadingButton(false)
    }
    const handleNotifButtonClick = () => {
        const resetNotif = async () => {
            const result = await updateSettings({
                expenseLimit: parseFloat(expenseLimit),
                isResetNotif: true
            })
            if (result.success) openSnackbar('success', 'Notification reset successful')
            else openSnackbar('error', result.message)
        }
        setLoadingNotifButton(true)
        resetNotif()
        setLoadingNotifButton(false)
    }
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const openSnackbar = (type: Color, message: string) => {
        setMessage(message)
        setSeverity(type)
        setOpen(true)
    }

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <Layout>
            <Fragment>
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {msg}
                    </Alert>
                </Snackbar>
                <Typography variant="h4" gutterBottom>Settings Page</Typography>
                <div style={{ height: 800, width: '100%' }}>
                    {loadingPage ? (
                        <CircularProgress />
                    ) : (
                        <Fragment>
                            <form noValidate autoComplete="off" className={classes.settingsForm}>
                                <Grid container spacing={2} >
                                    <Grid item lg={3} md={6} xs={12} >
                                        <TextField
                                            id="expense_limit"
                                            label="Expense Limit"
                                            variant="outlined"
                                            type="number"
                                            value={expenseLimit}
                                            onChange={handleExpenseLimitChange}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{
                                                maxLength: 13,
                                                step: "1"
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </form>
                            {loadingButton ? <CircularProgress />
                                : <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    size="medium"
                                    color='primary'
                                    className={classes.settingsFormBtn}
                                >Save Settings</Button>}
                            <Divider />
                            <Grid container spacing={2} className={classes.notificationSetting}>
                                <Grid item lg={3} md={6} xs={12} >
                                    <Typography variant='h6'>Last Expense Limit Notification Date: {lastNotifDate}</Typography>
                                    <Typography variant='subtitle2'>Resetting the notification will enable it to be sent again whenever you exceed your expense limit</Typography>
                                </Grid>
                            </Grid>
                            {loadingNotifButton ? <CircularProgress />
                                : <Button
                                    onClick={handleNotifButtonClick}
                                    variant="contained"
                                    size="medium"
                                    color='primary'
                                >Reset Notification</Button>}
                        </Fragment>
                    )}
                </div>
            </Fragment>
        </Layout>
    );
}

export default ProtectRoute(SetttingPage)