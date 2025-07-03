import express from "express";
import { checkAuth, login, logout, signup, updateprofile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post('/signup', signup);

route.post('/login', login);

route.post('/logout', logout);

route.put('/update-profile',protectRoute, updateprofile)

route.get('/check',protectRoute, checkAuth)

export default route;