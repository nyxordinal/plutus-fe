import useAuth, { ProtectRoute } from '@auth';
import Layout from '@components/layout';
import Loader from '@components/loader';
import { Expense } from '@interface/entity.interface';
import { EXPENSE_TYPE } from '@interface/enum';
import { Button, Grid, MenuItem, Snackbar, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Alert, Color } from '@material-ui/lab';
import { updateExpense } from '@services/expense.service';
import { ToArray, useLocalStorage } from '@util';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

const expenseType = ToArray(EXPENSE_TYPE)

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            marginBottom: '32px'
        }
    }),
);

const ExpenseUpdatePage = () => {
    const { isAuthenticated } = useAuth()
    const router = useRouter()
    const classes = useStyles();
    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [typeId, setTypeId] = useState<number>(1);
    const [price, setPrice] = useState<number>(0);
    const [date, setDate] = useState<Date>(new Date());
    const [severity, setSeverity] = useState<Color>('success');
    const [updateData, setUpdateData] = useLocalStorage<Expense>('updateDataExpense', {
        id: 0,
        name: "",
        typeId: 0,
        price: 0,
        date: new Date(),
    })

    useEffect(() => {
        setName(updateData.name)
        setTypeId(updateData.typeId)
        setPrice(updateData.price)
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
            const result = await updateExpense({
                id: updateData.id,
                name,
                typeId,
                price,
                date
            })
            if (result.success) {
                setUpdateData({
                    id: 0,
                    name: "",
                    typeId: 0,
                    price: 0,
                    date: new Date(),
                })
                router.push({
                    pathname: '/expense',
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
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);
    const handleTypeIdChange = (event: React.ChangeEvent<HTMLInputElement>) => setTypeId(parseInt(event.target.value, 10));
    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        isNaN(parseInt(event.target.value, 10))
            ? setPrice(0)
            : setPrice(parseInt(event.target.value, 10))
    };
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => setDate(new Date(event.target.value));

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <Layout>
            <Fragment>
                <Typography variant="h4" gutterBottom className={classes.title}>Expense Update Page</Typography>
                <div style={{ height: 800, width: '100%' }}>
                    <form noValidate autoComplete="off" >
                        <Grid container spacing={3} >
                            <Grid item xs={12} >
                                <Grid item lg={3} md={6} sm={12} >
                                    <TextField
                                        required
                                        id="name"
                                        label="Name"
                                        variant="outlined"
                                        value={name}
                                        onChange={handleNameChange}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item lg={3} md={6} sm={12}>
                                    <TextField
                                        required
                                        select
                                        id="type-id"
                                        label="Expense Type"
                                        variant="outlined"
                                        value={typeId}
                                        onChange={handleTypeIdChange}
                                        fullWidth
                                    >
                                        {expenseType.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item lg={3} md={6} sm={12}>
                                    <TextField
                                        id="price"
                                        required
                                        label="Price"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        value={price.toString()}
                                        onChange={handlePriceChange}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item lg={3} md={6} sm={12}>
                                    <TextField
                                        id="date"
                                        required
                                        label="Expense Date"
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
                                    >Update Expense</Button>
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

export default ProtectRoute(ExpenseUpdatePage)