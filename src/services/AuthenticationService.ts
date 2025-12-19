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
        .init({onLoad: "login-required", responseMode: "query"})
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

const RefreshToken = () => {
    return keycloak.onTokenExpired = () => {
        keycloak.updateToken(30)
            .then(() => {
                localStorage.setItem("token", <string>keycloak.token)
            })
            .catch((err) => {
                console.error(err)
            })
    }
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
    UpdateToken,
    RefreshToken
}

export default KeycloakService