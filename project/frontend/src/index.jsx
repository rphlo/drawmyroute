import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorkerRegistration";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

if (window.location.host === "mapdump.com") {
  Sentry.init({
    dsn: "https://faebc23b4f554998b7d05c57f25c0815@o91052.ingest.sentry.io/1435575",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.1,
  });
}

const container = document.getElementById('root')
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
