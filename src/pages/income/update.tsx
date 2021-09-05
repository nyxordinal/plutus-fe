import useAuth, { ProtectRoute } from '@auth';
import Layout from '@components/layout';
import Loader from '@components/loader';
import { Income } from '@interface/entity.interface';
import { Button, Grid, Snackbar, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Alert, Color } from '@material-ui/lab';
import { updateIncome } from '@services/income.service';
import { useLocalStorage } from '@util';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            marginBottom: '32px'
        }
    }),
);

const IncomeUpdatePage = () => {
    const { isAuthenticated } = useAuth()
    const router = useRouter()
    const classes = useStyles();
    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [source, setSource] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState<Date>(new Date());
    const [severity, setSeverity] = useState<Color>('success');
    const [updateData, setUpdateData] = useLocalStorage<Income>('updateDataIncome', {
        id: 0,
        source: "",
        amount: 0,
        date: new Date(),
    })

    useEffect(() => {
        setSource(updateData.source)
        setAmount(updateData.amount)
        setDate(new Date(updateData.date))
    }, [])

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const handleSubmit = () => {
        const update = async () => {
            const result = await updateIncome({
                id: updateData.id,
                source,
                amount,
                date
            })
            if (result.success) {
                setUpdateData({
                    id: 0,
                    source: "",
                    amount: 0,
                    date: new Date(),
                })
                router.push({
                    pathname: '/income',
                    query: { msg: result.message },
                })
            }
            else openSnackbar('error', result.message)
        }
        update()
    }
    const openSnackbar = (type: Color, message: string) => {
        setMessage(message)
        setSeverity(type)
        setOpen(true)
    }
    const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => setSource(event.target.value);
    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        isNaN(parseInt(event.target.value, 10))
            ? setAmount(0)
            : setAmount(parseInt(event.target.value, 10))
    };
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => setDate(new Date(event.target.value));

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <Layout>
            <Fragment>
                <Typography variant="h4" gutterBottom className={classes.title}>Income Update Page</Typography>
                <div style={{ height: 800, width: '100%' }}>
                    <form noValidate autoComplete="off" >
                        <Grid container spacing={3} >
                            <Grid item xs={12} >
                                <Grid item lg={3} md={6} sm={12} >
                                    <TextField
                                        required
                                        id="source"
                                        label="Source"
                                        variant="outlined"
                                        value={source}
                                        onChange={handleSourceChange}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item lg={3} md={6} sm={12}>
                                    <TextField
                                        required
                                        id="amount"
                                        label="Amount"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        value={amount.toString()}
                                        onChange={handleAmountChange}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item lg={3} md={6} sm={12}>
                                    <TextField
                                        id="date"
                                        required
                                        label="Income Date"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        value={date.toISOString().split('T')[0]}
                                        onChange={handleDateChange}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item lg={3} md={6} sm={12}>
                                    <Button
                                        onClick={handleSubmit}
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        fullWidth
                                    >Update Income</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {msg}
                    </Alert>
                </Snackbar>
            </Fragment>
        </Layout>
    );
}

export default ProtectRoute(IncomeUpdatePage)