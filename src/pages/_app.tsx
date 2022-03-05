import { AuthProvider } from '@auth';
import { blue, indigo } from '@material-ui/core/colors';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const theme = createTheme({
    palette: {
        primary: {
            main: blue[500]
        },
        secondary: {
            main: indigo['A400'],
        },
    },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <Fragment>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <link rel="shortcut icon" href="/favicon.ico" />
                <title>Plutus</title>
            </Head>
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <Provider store={store} >
                        <Component {...pageProps} />
                    </Provider>
                </AuthProvider>
            </ThemeProvider>
        </Fragment>
    )
}

export default MyApp