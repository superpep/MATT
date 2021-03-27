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
