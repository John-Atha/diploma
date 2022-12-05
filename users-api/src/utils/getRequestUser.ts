import JsonWebToken from "jsonwebtoken";

export const getRequestUser = (bearer: string) => {
  if (!bearer?.includes("Bearer ")) {
    return null;
  }
  try {
    const token = bearer.slice(7);
    const decoded = JsonWebToken.verify(
      token,
      process.env.SECRET_KEY || "placeholder421%$#^Secret1241Key"
    );
    return decoded;
  } catch (err) {
    return null;
  }
};
