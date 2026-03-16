import jwt from "jsonwebtoken";

function verifyJWT(request, response, next) {
  const authHeader = request.headers.authorization || request.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return response.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return response.sendStatus(403);
    }

    request.id = decoded.userInfo.id;
    request.name = decoded.userInfo.name;
    request.roles = decoded.userInfo.roles;
    next();
  });
}

export default verifyJWT;