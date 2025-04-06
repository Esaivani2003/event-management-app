import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Toaster position="top-right" />
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}
