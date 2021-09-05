import useAuth, { ProtectRoute } from "@auth";
import { Button, IconButton, InputAdornment, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Alert, Color } from "@material-ui/lab";
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

const LoginPage = () => {
    const { login } = useAuth()
    const classes = useStyles()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Color>('success');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleChangeEmail = () => (
        event: ChangeEvent<HTMLInputElement>
    ) => setEmail(event.target.value)
    const handleChangePassword = () => (
        event: ChangeEvent<HTMLInputElement>
    ) => setPassword(event.target.value)
    const handleSubmit = async () => {
        if (email === '' || password === '') {
            openSnackbar('warning', 'email and password is required')
        } else {
            const result = await login(
                email.trim(),
                password.trim()
            )
            if (!result.success) {
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
                <Typography variant="h4" align="center" gutterBottom>Plutus</Typography>
                <TextField
                    id="email"
                    label="Email"
                    value={email}
                    fullWidth
                    onChange={handleChangeEmail()}
                    variant='outlined'
                    required
                />
                <TextField
                    id="password"
                    label="Password"
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
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSubmit}
                    fullWidth
                    className={classes.formButton}
                >
                    Login
                </Button>
            </form>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={severity}>
                    {msg}
                </Alert>
            </Snackbar>
        </div>
    )
}
export default ProtectRoute(LoginPage, true)