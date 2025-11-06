import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    signupData: null,
    loading: false,
    token: null,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSignupData(state, action) {
            console.log("🔵 setSignupData called:", action.payload);
            state.signupData = action.payload;
        },
        setLoading(state, action) {
            console.log("🔵 setLoading called:", action.payload);
            state.loading = action.payload;
        },
        setToken(state, action) {
            console.log("🔵 setToken called:", action.payload);
            state.token = action.payload;
        },
        setUser(state, action) {
            // console.log(" setUser called with:", action.payload);
            // console.trace(" setUser called from:"); // This shows WHERE it was called from
            state.user = action.payload;
        },
        logout(state) {
            console.log(" LOGOUT called!");
            console.trace(" Logout called from:");
            state.user = null;
            state.token = null;
            state.signupData = null;
        }
    }
});

export const { setSignupData, setLoading, setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;