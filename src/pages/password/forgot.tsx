import { Button, CircularProgress, Divider, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";
import { sendForgotPasswordEmail } from "@services/password.service";
import { ValidateEmail } from "@util";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

const useStyles = makeStyles({
    base: {
        height: "100vh",
        background: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        maxWidth: '330px',
        margin: '0 auto',
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
    },
    formButton: {
        marginTop: '5px'
    },
    divider: {
        marginTop: '16px',
        marginBottom: '8px'
    }
})

const ForgotPasswordPage = () => {
    const classes = useStyles()
    const [email, setEmail] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Color>('success');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChangeEmail = () => (
        event: ChangeEvent<HTMLInputElement>
    ) => setEmail(event.target.value)
    const handleSubmit = async () => {
        if (email === '') {
            openSnackbar('warning', 'Email is required')
        } else if (!ValidateEmail(email)) {
            openSnackbar('warning', 'Please enter a valid email')
        } else {
            setLoading(true)
            const result = await sendForgotPasswordEmail(email)
            result.success
                ? openSnackbar('success', result.message)
                : openSnackbar('error', result.message)
            setLoading(false)
        }
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

    return (
        <div className={classes.base}>
            <form className={classes.form} noValidate autoComplete="off">
                <Typography variant="h5" align="center" gutterBottom>Plutus | Forgot Password</Typography>
                <TextField
                    id="email"
                    label="Your Email"
                    value={email}
                    fullWidth
                    onChange={handleChangeEmail()}
                    variant='outlined'
                    margin='normal'
                    required
                />
                {loading
                    ? <CircularProgress style={{ margin: '0 auto', display: 'table' }} />
                    : <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                        fullWidth
                        className={classes.formButton}
                    >
                        Send Reset Password Email
                    </Button>
                }
                <Divider className={classes.divider} />
                <Typography variant="subtitle1" align="center">Back to <Link href={"/login"}>login page</Link></Typography>
            </form>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={severity}>
                    {msg}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ForgotPasswordPage