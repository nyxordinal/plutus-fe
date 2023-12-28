import { AuthProvider } from "@auth";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { CurrencyProvider } from "currency";
import { AppProps } from "next/app";
import Head from "next/head";
import { Fragment } from "react";
import { Provider } from "react-redux";
import { store } from "redux/store";
import "../styles/tailwind.css";

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
      <Provider store={store}>
        <AuthProvider>
          <CurrencyProvider>
            <Component {...pageProps} />
          </CurrencyProvider>
        </AuthProvider>
      </Provider>
    </Fragment>
  );
};

export default MyApp;
