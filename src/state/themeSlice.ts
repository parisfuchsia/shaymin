import { createSlice, PayloadAction} from '@reduxjs/toolkit';

interface InitialStateType{
  theme: "light" | "dark";
}

const themeSlice = createSlice({
  name: "theme",
  initialState: <InitialStateType>{ theme: "light" },
  reducers:{
    changeTheme : (state, action: PayloadAction<"light" | "dark">): void => {
     state.theme = action.payload;
    },
    getTheme : (state): void => {
  const savedTheme: string | null = localStorage?.getItem('theme');
      if(savedTheme){
        state.theme = savedTheme
      }
    }
  }
})

export default themeSlice.reducer;
export const { changeTheme, getTheme } = themeSlice.actions;