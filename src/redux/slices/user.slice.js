import { createSlice } from "@reduxjs/toolkit";

const localUser = JSON.parse(localStorage.getItem("user")) || {};

const initialState = {
  id: localUser.id || null,
  name: localUser.name || null,
  currentChat: localUser.currentChat || null,
  currentRoomMeet: localUser.currentRoomMeet || null,
  email: localUser.email || null,
  contacts: localUser.contacts || null,
  JWT: localUser.JWT || null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const { id, name, email, JWT } = action.payload;
      const newState = { ...state, id, name, email, JWT };
      localStorage.setItem("user", JSON.stringify(newState));
      return newState;
    },
    logOut: (state, action) => {
      localStorage.clear();
      return initialState;
    },

    changeCurrentChat: (state, action) => {
      const currentChat = action.payload;
      const newState = { ...state, currentChat };
      return newState;
    },

    changeRoomMeet: (state, action) => {
      const { roomId, userId, contactId } = action.payload;
      const currentRoomMeet = {
        roomId: roomId || "",
        userId,
        contactId,
      };
      const newState = { ...state, currentRoomMeet };
      return newState;
    },

    changeContacts: (state, action) => {
      const contacts = JSON.parse(action.payload);
      const newState = { ...state, contacts };
      return newState
    },
  },
});

export const { logOut, login, changeCurrentChat, changeRoomMeet, changeContacts } =
  user.actions;

export default user.reducer;
