import jwt from "jsonwebtoken"

export const generateToken = (userId, res)=>{
  //  here we create the ID to check which user is which , and the user is Authenticated or not
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"});

  res.cookie("jwt", token, {
    maxAge: 7*24*60*60*1000, // 7 days in milliseconds
    httpOnly: true, // to prevent XSS attacks: cross-site scripting
    sameSite: "strict", // to prevent CSRF attacks: cross-site request forgery
    secure: process.env.NODE_ENV === "development" ? false : true // agr development me hai to secure false hoga, production me true hoga, kyuki production me https use hota hai, aur development me http use hota hai
  })

  return token;
    
}