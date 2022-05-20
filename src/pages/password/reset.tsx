import { Button, CircularProgress, IconButton, InputAdornment, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Alert, Color } from "@material-ui/lab";
import { resetPassword } from "@services/password.service";
import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useState } from "react";

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
    }
})

const ResetPasswordPage = () => {
    const classes = useStyles()
    const router = useRouter()
    const query = router.query
    const [password, setPassword] = useState<string>('')
    const [passwordConfirm, setPasswordConfirm] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Color>('success');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChangePassword = () => (
        event: ChangeEvent<HTMLInputElement>
    ) => setPassword(event.target.value)
    const handleChangePasswordConfirm = () => (
        event: ChangeEvent<HTMLInputElement>
    ) => setPasswordConfirm(event.target.value)
    const handleSubmit = async () => {
        if (!query['email'] || !query['reset-token']) {
            openSnackbar('error', 'Something is wrong, please reopen the password reset link in your email')
        } else if (password === '' || passwordConfirm === '') {
            openSnackbar('warning', 'Password and password confirmation are required')
        } else if (password !== passwordConfirm) {
            openSnackbar('warning', 'Password and password confirmation are not the same')
        } else if (password.length < 8) {
            openSnackbar('warning', 'Minimum password length is 8 characters')
        } else {
            setLoading(true)
            const result = await resetPassword(query["email"] as string, query["reset-token"] as string, password)
            if (result.success) {
                openSnackbar('success', 'Reset password success, you will be redirected to login page')
                setLoading(false)
                setTimeout(() => {
                    router.push('/login')
                }, 5000);
            } else {
                setLoading(false)
                openSnackbar('error', result.message)
            }
        }
    }
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const handleClickShowPassword = () =>
        setShowPassword(!showPassword)
    const handleMouseDownPassword = (event: MouseEvent) =>
        event.preventDefault()
    const openSnackbar = (type: Color, message: string) => {
        setMessage(message)
        setSeverity(type)
        setOpen(true)
    }

    return (
        <div className={classes.base}>
            <form className={classes.form} noValidate autoComplete="off">
                <Typography variant="h5" align="center" gutterBottom>Plutus | Reset Password</Typography>
                <TextField
                    id="password"
                    label="New Password"
                    value={password}
                    fullWidth
                    onChange={handleChangePassword()}
                    variant='outlined'
                    margin='normal'
                    required
                    type={
                        showPassword
                            ? 'text'
                            : 'password'
                    }
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    id="password-confirmation"
                    label="Password Confirmation"
                    value={passwordConfirm}
                    fullWidth
                    onChange={handleChangePasswordConfirm()}
                    variant='outlined'
                    margin='normal'
                    required
                    type={
                        showPassword
                            ? 'text'
                            : 'password'
                    }
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
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
                        Reset Password
                    </Button>
                }
            </form>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={severity}>
                    {msg}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ResetPasswordPage