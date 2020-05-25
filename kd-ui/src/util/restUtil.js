import { properties } from "../properties";
import { history } from "./history";
// import { toast } from "react-toastify";

const { API_ENDPOINT } = properties;
export const isLoading = false;
let accessToken =
  JSON.parse(localStorage.getItem("auth")) && JSON.parse(localStorage.getItem("auth")) !== null
    ? JSON.parse(localStorage.getItem("auth")).accessToken
    : "";
const initToken = () => {
  accessToken =
    JSON.parse(localStorage.getItem("auth")) && JSON.parse(localStorage.getItem("auth")) !== null
      ? JSON.parse(localStorage.getItem("auth")).accessToken
      : "";
};
export const setAccessToken = (token) => {
  accessToken = token;
};

function clean(obj) {
  for (var propName in obj) {
    const value = obj[propName];
    if (value === null || value === undefined || value === "") {
      delete obj[propName];
    }
  }
}

export const get = (api, params) => {
  if (!accessToken) initToken();
  clean(params);
  return new Promise((resolve, reject) => {
    let url = `${API_ENDPOINT}${api}`;
    if (params) {
      const keys = Object.keys(params);
      let query = keys.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])).join("&");
      if (keys.length) {
        url = `${url}?${query}`;
      }
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      },
    }).then((resp) => {
      if (resp.status && resp.status === 200) {
        return resolve(resp.json());
      } else {
        handleError(resp);
        return reject(resp);
      }
    });
  });
};

export const post = (api, body) => {
  if (!accessToken) initToken();
  return new Promise((resolve, reject) => {
    fetch(API_ENDPOINT + api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      if (resp.status && resp.status >= 200 && resp.status < 300) {
        return resolve(resp.json());
      } else {
        handleError(resp);
        return reject(resp);
      }
    });
  });
};

export const put = (api, body) => {
  if (!accessToken) initToken();
  return new Promise((resolve, reject) => {
    fetch(API_ENDPOINT + api, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      if (resp.status && resp.status === 200) {
        return resolve(resp.json());
      } else {
        handleError(resp);
        return reject(resp);
      }
    });
  });
};

export const deleteEntity = (api, id) => {
  if (!accessToken) initToken();
  return new Promise((resolve, reject) => {
    fetch(API_ENDPOINT + api, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      }
    }).then((resp) => {
      if (resp.status && resp.status === 200) {
        return resolve(resp.json());
      } else {
        handleError(resp);
        return reject(resp);
      }
    });
  });
};

const handleError = async (resp) => {
  const status = resp.status;
  const error = await resp.json().then((resp) => {
    switch (status) {
      case 401:
        history.push("/user/logout");
        // toast.error(resp.message ? resp.message : "Some error has occured...", { toastId: "error" });
        break;
      case 400:
        // toast.error(resp.message ? resp.message : "Some error has occured...", { toastId: "error" });
        break;
      default:
        console.error(resp.message ? resp.message : "Some error has occured...");
        break;
    }
    return resp;
  });
  return error;
};
