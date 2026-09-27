import jwt from 'jsonwebtoken';
import HttpError from './httpError.js'; // 👈 നിങ്ങളുടെ ഇതേ ഫോൾഡറിലുള്ള HttpError ഇംപോർട്ട് ചെയ്തു

export const verifyToken = (req, res, next) => {
  // 1. Request Headers-ൽ നിന്ന് ടോക്കൺ എടുക്കുന്നു
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer <token>' ഫോർമാറ്റിൽ നിന്ന് ടോക്കൺ മാറ്റുന്നു

  // ടോക്കൺ ഇല്ലെങ്കിൽ അപ്പോൾ തന്നെ തടയുന്നു (Unauthorized)
  if (!token) {
    return next(new HttpError("Access Denied: No Token Provided!", 401));
  }

  try {
    // 2. .env ഫയലിലെ JWT_SECRET വെച്ച് ടോക്കൺ പരിശോധിക്കുന്നു
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // ടോക്കണിലുള്ള യൂസർ വിവരങ്ങൾ (user_id, email, role) req.user-ലേക്ക് മാറ്റുന്നു

    // 🔒 ADMIN CHECK: ലോഗിൻ ചെയ്ത യൂസറുടെ ഇമെയിൽ നിങ്ങളുടെ .env-ലെ അഡ്മിൻ ഇമെയിൽ ആണോ എന്ന് നോക്കുന്നു
    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return next(new HttpError("Access Denied: You are not authorized to modify products!", 403));
    }
    
    next(); // അഡ്മിൻ നിങ്ങൾ തന്നെയാണെങ്കിൽ പ്രൊഡക്റ്റ് ആഡ്/ഡിലീറ്റ് ചെയ്യാൻ അനുവദിക്കുന്നു!
  } catch (error) {
    // ടോക്കൺ തെറ്റാണെങ്കിലോ എക്സ്പെയർ ആയാലോ
    return next(new HttpError("Invalid or Expired Token!", 403));
  }
};