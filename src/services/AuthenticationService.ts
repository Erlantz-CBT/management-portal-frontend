import Keycloak from "keycloak-js";



const keycloak = new Keycloak()

interface CbOneParam<T1 = void, T2 = void> {
    (param1: T1): T2;
}

/**
 * Keycloak instance initialization
 *
 * @param onAuthenticatedCB
 */

const Login = (onAuthenticatedCB: CbOneParam) => {
    keycloak
        .init({onLoad: "login-required"})
        .then(function (authenticated) {
            authenticated ? onAuthenticatedCB() : alert("non authenticated user");
            if (authenticated) {
                localStorage.setItem("token", <string>keycloak.token)
            }
            // return authenticated
        })
        .catch((e) => {
            console.dir(e);
            console.log(e)
        });
};


const Logout = () => {
    return keycloak.logout()
}

const UpdateToken = () => {
    return keycloak.updateToken(30)
}

const getToken = () => {
    return keycloak.token
}

const getUser = () => {
    return keycloak.tokenParsed
}


const KeycloakService = {
    CallLogin: Login,
    CallLogout: Logout,
    User: getUser,
    Token: getToken,
    UpdateToken
}

export default KeycloakService