// code scaffold by: https://www.w3schools.com/js/js_cookies.asp

export const getCookie = (cname: string) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const setCookie = (cname: string, cvalue: string, exdays?: number) => {
  let exp = "";
  if (exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    exp = "expires=" + d.toUTCString();
  }
  document.cookie = cname + "=" + cvalue + ";" + exp + ";path=/";
};

export const deleteCookie = (name: string) => {
  document.cookie = name + "=; path=/;";
}