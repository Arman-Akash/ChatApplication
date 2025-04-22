import * as storage from '../axios/storage';
import * as keys from '../axios/keys';

export const Authorize = (roles) => {
    var user = storage.loadState(keys.LOGGED_IN_USER);

    if(roles != undefined && roles != null) {
        for(var i = 0; i < roles.length; i++) {
            if(user?.roles?.includes(roles[i])) {
                return true;
            }
        }
    }
    
    return false;
}