import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {

    render() {
        return (
            <Html>
                <Head >
                    <meta charSet="utf-8" />
                    <meta name="theme-color" content="#000000" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                </Head>
                <body style={
                    {
                        margin: 0,
                        padding: 0,
                    }
                }>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument