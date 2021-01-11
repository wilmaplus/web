import {Router} from "@angular/router";
import {AuthApi} from "../../authapi/auth_api";

function addCommandApplied() {
  return window.history.state.add;
}

export function preCheck(router: Router, authApi: AuthApi) {
  if (!addCommandApplied()) {
    authApi.accountsExist((exists) => {
      if (exists)
        router.navigate(['/']);
    }, error => {
      console.log(error);
    });
  }
}
