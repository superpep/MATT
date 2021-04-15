export const updateDrawerState = (state, opened) => {
  state.drawerState = opened
}

export const updateLoggedUser = (state, data) => {
  state.user = {
    dni: data.dni,
    name: data.name,
    isAdmin: data.isAdmin
  }
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
