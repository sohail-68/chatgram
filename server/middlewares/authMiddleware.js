const jwt=require("jsonwebtoken")

const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization');

    // यदि token नहीं है, तो 401 Unauthorized error भेजें
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    try {
      // Token को verify करें और payload प्राप्त करें
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
 //decoded);
  
      // req.user में decoded payload को जोड़ें
      req.user = decoded.user;
      
  
      // Middleware को आगे बढ़ाएँ
      next();
    } catch (err) {
      // Token invalid है, तो 401 Unauthorized error भेजें
      res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports=isAuthenticated
