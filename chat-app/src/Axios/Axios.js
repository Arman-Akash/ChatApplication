import axios from 'axios';
import { apiUrl as DEVELOPMENT_URL } from '../config';
import * as keys from './keys';
import * as storage from './storage';

const createConfig = () => {
    var data = storage.loadState(keys.LOGGED_IN_USER);
    if (data !== undefined) {
        return {
            headers: {
                "Authorization": `Bearer ${data.token}`,
                "Access-Control-Allow-Origin": "*",
                "access-control-expose-headers": "*",
                "access-control-allow-methods": "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS"
            }
        };
    } else {
        return undefined;
    }
}

// var DEVELOPMENT_URL = apiUrl

// fetch('manifest.json', {
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     }
// }
// ).then(function (response) {
//     return response.json();
// }).then(function (menifest) {
//     DEVELOPMENT_URL = menifest.api_url;
// });

export const filterNull = (data) => {
    if (data !== null && data !== undefined) {
        for (var i = 0; i < data.length; i++) {
            for (var property in data[i]) {
                if (data[i][property] === "null" || data[i][property] === null) {
                    data[i][property] = "";
                }
            }
        }
    }
    return data;
}

export const get = (url, setData, callBack) => {
    axios.get(`${DEVELOPMENT_URL}/${url}`, createConfig())
        .then(response => {
            if(response.status === 200 && setData !== undefined) {
                setData({
                    data: filterNull(response.data.data),
                    pageconfig: response.data.pageconfig,
                    success: response.data.success,
                    message: response.data.message,
                    statusCode: response.data.statusCode
                });
            }

            if (callBack !== undefined) {
                callBack(response.data);
            }
        })
        .catch(error => {
            console.log(error);
        });
}


export const post = (url, postData, setData, callBack, failed) => {
    axios.post(`${DEVELOPMENT_URL}/${url}`, postData, createConfig())
        .then(response => {
            if(response.status === 200 && setData !== undefined) {
                setData({
                    data: filterNull(response.data.data),
                    pageconfig: response.data.pageconfig,
                    success: response.data.success,
                    message: response.data.message,
                    statusCode: response.data.statusCode
                });
            }

            if (callBack !== undefined) {
                callBack(response.data);
            }
        })
        .catch(error => {
            if(failed!== undefined) {
                failed(error);
            }
            console.log(error);
        });
}

export const put = (url, data, setData, callBack) => {
    axios.put(`${DEVELOPMENT_URL}/${url}`, data, createConfig())
        .then(response => {
            if(response.status === 200 && setData !== undefined) {
                setData({
                    data: filterNull(response.data.data),
                    pageconfig: response.data.pageconfig,
                    success: response.data.success,
                    message: response.data.message,
                    statusCode: response.data.statusCode
                });
            }

            if (callBack !== undefined) {
                callBack(response.data);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export const deleteRequest = (url, callBack) => {
    axios.delete(`${DEVELOPMENT_URL}/${url}`, createConfig())
        .then(response => {
            if (callBack !== undefined) {
                callBack(response.data);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export const postFormData = (url, postData, list, files, handleOther) => {
    const formData = new FormData()


    // [{"name":"propertyName", "array":list}]
    if (list !== undefined && list !== null) {
        list.forEach(obj => {
            if (postData.hasOwnProperty(obj.name)) {
                delete postData[obj.name]
            }
            for (var i = 0; i < obj.array?.length; i++) {
                for (var property in obj.array[i]) {
                    formData.append(`${obj.name}[${i}].${property}`, obj.array[i][property]);
                }
            }
        });
    }

    if (files !== undefined && files !== null) {
        files.forEach(file => {
            if (file.attachment !== null) {
                if (file.attachment.length !== undefined) {
                    for (var i = 0; i < file.attachment.length; i++) {
                        formData.append(
                            file.name,
                            file.attachment[i]
                        )
                    }
                } else {
                    formData.append(
                        file.name,
                        file.attachment
                    )
                }
            }
        });
    }

    for (var property in postData) {
        formData.append(
            property,
            postData[property] == null ? "" : postData[property]
        )
    }

    axios.post(`${DEVELOPMENT_URL}/${url}`, formData, createConfig())
        .then(response => {
            if (handleOther !== undefined) {
                handleOther(response);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export const putFormData = (url, postData, list, files, handleOther) => {
    const formData = new FormData()

    if (list !== undefined && list !== null) {
        list.forEach(obj => {
            if (postData.hasOwnProperty(obj.name)) {
                delete postData[obj.name]
            }
            for (var i = 0; i < obj.array?.length; i++) {
                delete obj.array[i].createdTime;
                delete obj.array[i].updatedTime;
                for (var property in obj.array[i]) {
                    formData.append(`${obj.name}[${i}].${property}`, obj.array[i][property] == null ? "" : obj.array[i][property]);
                }
            }
        });
    }

    if (files !== undefined && files !== null) {
        files.forEach(file => {
            if (file.attachment !== undefined && file.attachment !== null) {
                if (file.attachment.length !== undefined) {
                    for (var i = 0; i < file.attachment.length; i++) {
                        formData.append(
                            file.name,
                            file.attachment[i]
                        )
                    }
                } else {
                    formData.append(
                        file.name,
                        file.attachment
                    )
                }
            }
        });
    }

    delete postData.createdTime;
    delete postData.updatedTime;
    for (var property in postData) {
        formData.append(
            property,
            postData[property] == null ? "" : postData[property]
        )
    }

    axios.put(`${DEVELOPMENT_URL}/${url}`, formData, createConfig())
        .then(response => {
            if (handleOther !== undefined) {
                handleOther(response);
            }
        })
        .catch(error => {
            console.log(error);
        });
}