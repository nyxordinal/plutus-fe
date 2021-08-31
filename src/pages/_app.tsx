import { AuthProvider } from '@auth';
import { blue, indigo } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';

const theme = createMuiTheme({
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
                <title>Plutus</title>
            </Head>
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <Component {...pageProps} />
                </AuthProvider>
            </ThemeProvider>
        </Fragment>
    )
}

export default MyApp