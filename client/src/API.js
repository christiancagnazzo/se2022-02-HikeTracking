const URL = "http://localhost:3001/"

async function pushFile(formData){
  try {
    const response = await fetch(URL + 'file', {
    method: 'POST',
    body: formData
  })
  if (response.ok){
  }
  else {
    return false
  }
  }
  catch(e) {
    throw e
  }
}

  async function login(credentials) {
    let response = await fetch(URL+'sessions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  
  async function logout() {
    await fetch(URL+'sessions/current', { method: 'DELETE', credentials: 'include' });
  }
  
  async function getUserInfo() {
    const response = await fetch(URL+'sessions/current', {credentials: 'include'});
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }



  async function getHikes(filter){   
    const response = await fetch(URL+'hikes?filter='+filter,{method: 'GET', credential: 'include'})
    const up=await response.json();
    if (response.ok){
      return up;
    }else{
      throw up;
    }
  }

const API = {login,logout, getUserInfo,getHikes,pushFile};
export default API;
