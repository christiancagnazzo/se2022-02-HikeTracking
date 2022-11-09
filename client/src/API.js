const URL = "http://localhost:8000/hiketracking/"

async function pushFile(formData){
    try {
      const response = await fetch(URL + 'hike/', {
        method: 'POST',
        body: formData
    })
    if (response.ok){
      console.log("ookk")
    }
    else {
      return false
    }
    }
    catch(e) {
      throw e
    }
}

//USED TO GET INFO ABOUT QUEE FROM SERVER
async function getAllInfos(){
    const response = await fetch(URL);
    const services = await response.json();
    if(response.ok){
        return services.map((c) => ({id:c.id, info1:c.info1, info2:c.info2, info3:c.info1info3}))
    } else {
        throw services;
    }
}
async function postQueue(n) {
  let response = await fetch(URL, {
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



  async function getHikes(filter,userPower){   
    if (userPower!=="")
      userPower+='/'
    const response = await fetch(URL+userPower+'hikes?filter='+filter,{method: 'GET', credential: 'include'})
    const up=await response.json();
    if (response.ok){
      return up;
    }else{
      throw up;
    }
  }

const API = {login,logout, getUserInfo,getHikes,pushFile};
export default API;
