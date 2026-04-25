import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/reset.scss";
import "@/styles/global.scss";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { setAccessTokenGetter, setStoreDispatch } from "./services/api.js";

setAccessTokenGetter(() => store.getState().auth.access);
setStoreDispatch(store.dispatch);

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <App />
    </Provider>
);
