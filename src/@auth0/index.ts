import auth0 from "auth0-js";
import auth0Keys from "../config/auth0-keys.json";

const webAuth = new auth0.WebAuth({
  ...auth0Keys,
  audience: "https://dev-eh51a9uz.us.auth0.com/api/v2/",
  scope: 'openid email',
});

export default webAuth;