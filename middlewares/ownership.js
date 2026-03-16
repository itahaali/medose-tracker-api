function verifyRoles(...rolesList) {
  return function(request, response, next) {
    if (!request?.roles) {
      return response.sendStatus(401);
    }

    const rolesArray = [...rolesList]
    const hasRole = request.roles.some(role => rolesArray.includes(role));
    if (!hasRole) {
      return response.sendStatus(403);
    }
    
    next();
  }
}

export default verifyRoles;