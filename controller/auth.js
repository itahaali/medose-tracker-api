import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

async function registerUser(request, response) {
  const { name, email, password, roles } = request.body;
  if (!name || !email || !password) {
    return response.sendStatus(400);
  }

  try {
    const duplicate = await User.findOne({ email });
    if (duplicate) {
      return response.status(409).json({ "message": "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashPassword,
      ...(roles && { roles })
    });

    return response.status(201).json({ "message": `new User ${ name } is registered` });
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

async function logInUser(request, response) {
  const { email, password } = request.body;
  if (!email || !password) {
    return response.sendStatus(400);
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return response.sendStatus(401);
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const accessToken = jwt.sign(
        { 
          "userInfo": { 
            id: foundUser._id, 
            name: foundUser.name, 
            roles: Object.values(foundUser.roles) 
          } 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      response.cookie("jwt", refreshToken, { 
        httpOnly: true,
        // sameSite: "None",
        // secure: false, 
        maxAge: 24*60*60*1000 
      });
      return response.status(200).json({ 
        "message": `${ foundUser.name } has login`,
        "Access Token": accessToken 
      });
    } else {
      return response.sendStatus(401);
    }
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

async function logOutUser(request, response) {
  if (!request.cookies?.jwt) {
    return response.sendStatus(204);
  }

  const refreshToken = request.cookies.jwt;
  try {
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
      response.clearCookie("jwt", { httpOnly: true });
      return response.sendStatus(401);
    }

    foundUser.refreshToken = "";
    await foundUser.save();    

    response.clearCookie("jwt", { 
      httpOnly: true 
      // sameSite: "None", 
      // secure: false 
    });

    return response.sendStatus(204);
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

async function refreshAccessToken(request, response) {
  if (!request.cookies?.jwt) {
    return response.sendStatus(401);
  }

  const refreshToken = request.cookies.jwt;
  try{
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
      return response.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return response.sendStatus(403);
      }

      const accessToken = jwt.sign(
        { 
          "userInfo": { 
            id: foundUser._id, 
            name: foundUser.name, 
            roles: Object.values(foundUser.roles) 
          } 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      response.status(200).json({ accessToken });
    });
  } catch (error) {
    return response.status(500).json({ "message": error.message });
  }
}

export { registerUser, logInUser, logOutUser, refreshAccessToken };