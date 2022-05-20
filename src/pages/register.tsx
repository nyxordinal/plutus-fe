import useAuth from "@auth";
import { Button, CircularProgress, Divider, IconButton, InputAdornment, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Alert, Color } from "@material-ui/lab";
import { ValidateEmail } from "@util";
import Link from "next/link";
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
    },
    circularProgress: {
        margin: '0 auto',
        display: 'table'
    },
    divider: {
        marginTop: '16px',
        marginBottom: '8px'
    }
})

const RegisterPage = () => {
    const { register } = useAuth()
    const classes = useStyles()
    const router = useRouter()
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirm, setPasswordConfirm] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Color>('success');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loadingLogin, setLoadingLogin] = useState<boolean>(false);

    const handleChangeName = () => (
        event: ChangeEvent<HTMLInputElement>
    ) => setName(event.target.value)
    const handleChangeEmail = () => (
        event: ChangeEvent<HTMLInputElement>
    ) => setEmail(event.target.value)
    const handleChangePassword = () => (
        event: ChangeEvent<HTMLInputElement>
    ) => setPassword(event.target.value)
    const handleChangePasswordConfirm = () => (
        event: ChangeEvent<HTMLInputElement>
    ) => setPasswordConfirm(event.target.value)
    const handleSubmit = async () => {
        if (name === '') {
            openSnackbar('warning', 'Name is required')
        } else if (email === '') {
            openSnackbar('warning', 'Email is required')
        } else if (!ValidateEmail(email)) {
            openSnackbar('warning', 'Please enter a valid email')
        } else if (password === '' || passwordConfirm === '') {
            openSnackbar('warning', 'Password and password confirmation is required')
        } else if (password !== passwordConfirm) {
            openSnackbar('warning', 'Password and password confirmation are not the same')
        } else if (password.length < 8) {
            openSnackbar('warning', 'Minimum password length is 8 characters')
        } else {
            setLoadingLogin(true)
            const result = await register(name.trim(), email.trim(), password.trim())
            if (result.success) {
                openSnackbar('success', `Registration is successful, you will be redirected to login page`)
                setLoadingLogin(false)
                setTimeout(() => {
                    router.push('/login')
                }, 5000);
            } else {
                openSnackbar('error', result.message)
                setLoadingLogin(false)
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
                <Typography variant="h4" align="center" gutterBottom>Plutus | Register</Typography>
                <TextField
                    id="name"
                    label="Name"
                    value={name}
                    fullWidth
                    onChange={handleChangeName()}
                    variant='outlined'
                    required
                />
                <TextField
                    id="email"
                    label="Email"
                    value={email}
                    fullWidth
                    onChange={handleChangeEmail()}
                    variant='outlined'
                    margin='normal'
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
                {loadingLogin
                    ? <CircularProgress className={classes.circularProgress} />
                    : <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                        fullWidth
                        className={classes.formButton}
                    >
                        Register
                    </Button>
                }
                <Divider className={classes.divider} />
                <Typography variant="subtitle1" align="center">Already have an account? <Link href={"/login"}>Login</Link></Typography>
            </form>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={severity}>
                    {msg}
                </Alert>
            </Snackbar>
        </div>
    )
}
export default RegisterPage