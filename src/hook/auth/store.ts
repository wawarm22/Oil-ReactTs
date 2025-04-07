import createStore from "react-auth-kit/createStore";
import { refresh } from "./refresh";
import { AuthSchema } from "../../types/schema/auth";

export const store = createStore<AuthSchema>({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
  refresh: refresh,
});
