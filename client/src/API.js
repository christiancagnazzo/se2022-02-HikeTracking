const URL = "http://localhost:8000/hiketracking/"

async function createHike(hike_description, hike_file, token) {
  const valid_token = ('Token ' + token).replace('"', '').slice(0, -1)

  try {
    let response = await fetch(URL + 'hikes/', {
      method: 'PUT',
      body: JSON.stringify(hike_description),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': valid_token
      },
    })

    if (response.status == '200') {
      response = await response.json()
      let second_response = await fetch(URL + 'hike/file/' + response['hike_id'], {
        method: 'PUT',
        body: hike_file,
        headers: {
          'Authorization': valid_token
        },
      })

      if (second_response.status == '200')
        return { msg: "Hike Creato" };

      return { error: true, msg: "Something went wrong. Please check all fields and try again" };
    }

    return { error: true, msg: "Something went wrong. Please check all fields and try again" };
  }

  catch (e) {
    console.log(e) // TODO
  }
}




async function deleteHike(title, token) {
  const valid_token = ('Token ' + token).replace('"', '').slice(0, -1)
  try {
    let response = await fetch(URL + 'hikes/' + title, {
      method: 'DELETE',
      headers: {
        'Authorization': valid_token
      }
    })
    if (response.status == 200) {
      return true
    }

  } catch (e) {
    console.log(e)
  }
}


async function getHike(title, token) {

  const valid_token = ('Token ' + token).replace('"', '').slice(0, -1)

  try {
    let response = await fetch(URL + 'hikes/' + title, {
      headers: {
        'Authorization': valid_token
      }
    })

    if (response.status == 200) {
      const hike = await response.json()
      return hike
    }
  }
  catch (e) {
    console.log(e)
  }
}

async function createHut(hut_description, token) {
  const valid_token = ('Token ' + token).replace('"', '').slice(0, -1)
  console.log(hut_description)
  try {
    let response = await fetch(URL + 'hut/', {
      method: 'POST',
      body: JSON.stringify(hut_description),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': valid_token
      },
    })

    if (response.status == '200')
      return { msg: "Hut created" };

    return { error: true, msg: "Something went wrong. Please check all fields and try again" };
  }

  catch (e) {
    console.log(e) // TODO
  }
}

async function createParkingLot(parking_lot_description, token) {
  const valid_token = ('Token ' + token).replace('"', '').slice(0, -1)

  try {
    let response = await fetch(URL + 'parkingLots/', {
      method: 'POST',
      body: JSON.stringify(parking_lot_description),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': valid_token
      },
    })
    if (response.status == '201')
      return { msg: "Parking Lot created" };
    else
      return { error: true, msg: "Something went wrong. Please check all fields and try again" };
  }

  catch (e) {
    console.log(e) // TODO
  }
}

async function login(credentials) {
  let response = await fetch(URL + 'login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (response.status == '200')
    return { msg: await response.json() }
  else {
    return { error: 'Error', msg: "Something went wrong in the login. Please try again" }
  }
}

async function signin(credentials) {
  let response = await fetch(URL + 'register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (response.status == '200')
    return { msg: await response.json() }
  else {
    return { error: 'Error', msg: "Something went wrong during the registration. This email is associated with an existing account." }
  }

}

async function logout(token) {
  const valid_token = token = ('Token ' + token).replace('"', '').slice(0, -1)
  await fetch(URL + 'logout/', {
    method: 'POST',
    headers: {
      'Authorization': valid_token
    },
  });
}

async function getAllHikes(token, filters, userPower) {
  const  token = ('Token ' + token).replace('"', '').slice(0, -1)

  let query = ''

  if (filters) {
    query += '?filters=true'
    if (filters.minLength)
      query += '&minLength=' + filters.minLength
    if (filters.maxLength)
      query += '&maxLength=' + filters.maxLength
    if (filters.minTime)
      query += '&minTime=' + filters.minTime
    if (filters.maxTime)
      query += '&maxTime=' + filters.maxTime
    if (filters.minAscent)
      query += '&minAscent=' + filters.minAscent
    if (filters.maxAscent)
      query += '&maxAscent=' + filters.maxAscent
    if (filters.difficulty !== 'All')
      query += '&difficulty=' + filters.difficulty
    if (filters.province !== '-')
      query += '&province=' + filters.province
    if (filters.village !== "")
      query += '&village=' + filters.village
    if (filters.position !== '')
      query += '&around=' + filters.position.lat + "-" + filters.position.lng + "-" + filters.radius
  }

  let response = await fetch(URL + 'hikes/' + query, {
    method: 'GET',
    headers: {
      //'Authorization': valid_token
    },
  });

  if (response.status == '200') {
    let hikes = await response.json();
    if (userPower === "hiker") {
      for (hike of hikes) {
        const h = hike;
        h['file'] = await getHikeFile(h['id'], token);
      }
    };
    return { msg: hikes }
  }
  else {
    return { error: 'Error', msg: "Something went wrong. Please try again" }
  }
}


async function getHikeFile(hike_id, token) {
  const  token = ('Token ' + token).replace('"', '').slice(0, -1)
  let response = await fetch(URL + 'hike/file/' + hike_id, {
    method: 'GET',
    headers: {
      //'Authorization': valid_token
    },
  });
  if (response.status === 200) {
    const text = new TextDecoder().decode((await response.body.getReader().read()).value);
    return text
  }
}

async function getAllHuts(token, filters) {
  const token = ('Token ' + token).replace('"', '').slice(0, -1)

  let query = ''

  if (filters) {
    query += '?filters=true'
    if (filters.name)
      query += '&name=' + filters.name
    if (filters.nbeds)
      query += '&nbeds=' + filters.nbeds
    if (filters.fee)
      query += '&fee=' + filters.fee
    if (filters.start_lat && filters.start_lon)
      query += '&start_lat=' + filters.start_lat + '&start_lon=' + filters.start_lon
    if (filters.services && filters.services.length > 0) {
      let res = filters.services.map((s) => s.id).toString().replace(",", "-")
      query += '&services=' + res
    }
  }

  let response = await fetch(URL + 'hut/' + query, {
    method: 'GET',
    headers: {
      //'Authorization': valid_token
    },
  });
  if (response.status == '200')
    return { msg: await response.json() }
  else {
    return { error: 'Error', msg: "Something went wrong. Please try again" }
  }
}

async function checkAuth(token) {
  const valid_token = token = ('Token ' + token).replace('"', '').slice(0, -1)
  let response = await fetch(URL + 'sessions/', {
    method: 'GET',
    headers: {
      'Authorization': valid_token
    },
  });
  if (response.status == '200')
    return { msg: await response.json() }
  else {
    return { error: 'Error', msg: "Something went wrong. Please try again" }
  }
}

async function getAllParkingLots(token, filters) {
  const  token = ('Token ' + token).replace('"', '').slice(0, -1)

  let query = ''

  if (filters) {
    query += '?filters=true'
    if (filters.start_lat && filters.start_lon)
      query += '&start_lat=' + filters.start_lat + '&start_lon=' + filters.start_lon
  }

  let response = await fetch(URL + 'parkingLots/' + query, {
    method: 'GET',
    headers: {
      //'Authorization': valid_token
    },
  });
  if (response.status == '200')
    return { msg: await response.json() }
  else {
    return { error: 'Error', msg: "Something went wrong. Please try again" }
  }
}

async function getFacilities() {
  let response = await fetch(URL + 'facilities/', {
    method: 'GET',

  });
  if (response.status == '200')
    return { msg: await response.json() }

  else {
    return { error: 'Error', msg: "Something went wrong. Please try again" }
  }
}

async function setProfile(preferences, token) {
  const valid_token = ('Token ' + token).replace('"', '').slice(0, -1)

  try {
    let response = await fetch(URL + 'profile/', {
      method: 'PUT',
      body: JSON.stringify(preferences),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': valid_token
      },
    })
    if (response.status == '200')
      return { msg: "Profile updated!"}
    else {
      return { error: 'Error', msg: "Something went wrong. Please try again" }
    }
  }
  catch(e) {
    console.log(e)
  }
}

async function getProfile(token) {
  const valid_token = token = ('Token ' + token).replace('"', '').slice(0, -1)
  let response = await fetch(URL + 'profile/', {
    method: 'GET',
    headers: {
      'Authorization': valid_token
    },
  });
  if (response.status == '200') {
    return { msg: await response.json() }
  }
  else {
    return { error: "Something went wrong. Please try again" }
  }
}

async function getRecommendedHikes(token){
  const valid_token = token = ('Token ' + token).replace('"', '').slice(0, -1)
  let response = await fetch(URL + 'hikes/recommended/',{
    headers:{
      'Authorization': valid_token
    },
  })
  if (response.status == 200){
    return {msg: await response.json()}
  } else {
    return {error: "Something went wrong. Please try again"}
  }
}

async function getAccountsToValidate(token){
  const valid_token = token = ('Token ' + token).replace('"', '').slice(0, -1)
  let response = await fetch(URL + 'users/validate/',{
    headers:{
      'Authorization': valid_token
    },
  })
  if (response.status == 200){
    return {msg: await response.json()}
  } else {
    return {error: "Error", msg: "Something went wrong. Please try again"}
  }
}

async function activateAccount(params, token) {
  const valid_token = ('Token ' + token).replace('"', '').slice(0, -1)

  try {
    let response = await fetch(URL + 'users/validate/', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': valid_token
      },
    })
    if (response.status == '200')
      return { msg: "Updated!"}
    else {
      return { error: 'Error', msg: "Something went wrong. Please try again" }
    }
  }
  catch(e) {
    console.log(e)
  }
}

async function getHutWorkerHikes(token) {
  const valid_token = ('Token ' + token).replace('"', '').slice(0, -1)
  try {
    const response = await fetch(URL + "worker/hikes/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': valid_token
      },
    })
    if (response.status === 200) {
      return ({msg : await response.json()})
    }
    else {
      return ({err: await response.json()})
    }
  }
  catch(e) {
    console.log(e)
  }
}

async function updateCondition(condition, token){
  const valid_token = ('Token ' + token).replace('"', '').slice(0, -1)

  try {
    let response = await fetch(URL + 'worker/hikes/', {
      method: 'PUT',
      body: JSON.stringify(condition),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': valid_token
      },
    })

    if (response.status == '200')
      return { msg: "Condition updated" };
    
    return { error: true, msg: "Something went wrong. Please check all fields and try again" };
  }
  catch(e){
    console.log(e)
  }
}

const API = { activateAccount, getAccountsToValidate, getProfile, setProfile, login, logout, createParkingLot, getFacilities, createHike, signin, getAllHikes, checkAuth, getAllHuts, getAllParkingLots, createHut, getHike, deleteHike, getHikeFile, getRecommendedHikes, getHutWorkerHikes, updateCondition };
export default API;
