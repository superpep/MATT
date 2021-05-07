export const updateDrawerState = (state, opened) => {
  state.drawerState = opened
}

export const SET_LOGGED_IN = (state, value) => {
  state.user.loggedIn = value
}

export const SET_USER = (state, data) => {
  state.user.data = data
}

export const updateLoggedUser = (state, data) => {
  state.user = data.uid
}

export const addSegmentTime = (state, data) => {
  state.segment_times = data.data
  state.segment_times.innerId = data.innerId
}

export const addUser = (state, data) => {
  state.allUsers.push({
    name: data.data.name,
    isAdmin: data.data.isAdmin,
    isActive: data.data.isActive,
    passwd: data.data.passwd,
    dni: data.dni
  })
}

export const updatePass = (state, data) => {
  state.allUsers[data.numUser].passwd = data.newPass
}

export const updateName = (state, data) => {
  state.allUsers[data.numUser].name = data.name
}

export const activateUser = (state, userDni) => {
  console.log(userDni)
  state.allUsers.forEach(user => {
    if (user.dni === userDni) {
      user.isActive = true
    }
  })
}

export const deleteUser = (state, numUser) => {
  state.allUsers.splice(numUser, 1)
}

export const addPatient = (state, data) => {
  const newData = data.data
  newData.innerId = data.innerId
  state.allPatients.push(newData)
}

export const deletePatient = (state, numPatient) => {
  state.allPatients.splice(numPatient, 1)
}

export const editName = (state, newName) => {
  state.user.data.displayName = newName
}

export const editEmail = (state, newEmail) => {
  state.user.data.email = newEmail
}
