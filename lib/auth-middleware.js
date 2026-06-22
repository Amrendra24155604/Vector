const jwt = require('jsonwebtoken');
const dbConnect = require('./db-connect');
const User = require('../models/User');

async function verifyAuth(req) {
  try {
    await dbConnect();
    
    let authHeader = '';
    if (typeof req.headers.get === 'function') {
      authHeader = req.headers.get('authorization') || '';
    } else if (req.headers && req.headers.authorization) {
      authHeader = req.headers.authorization;
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'careerpilot_dev_secret_2024');
    
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Calculate and update the streak if a new day has started or if it's the first login
    const now = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    const isMonday = now.getDay() === 1;

    if (!lastActive || user.streak === 0) {
      user.streak = 1;
      user.lastActiveDate = now;
      await user.save();
    } else {
      const getLocalDateString = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const nowDateStr = getLocalDateString(now);
      const lastActiveDateStr = getLocalDateString(lastActive);

      if (nowDateStr !== lastActiveDateStr) {
        if (isMonday) {
          user.streak = 1;
        } else {
          const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const lastActiveLocal = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
          const diffDays = Math.floor((nowLocal - lastActiveLocal) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            user.streak = (user.streak || 0) + 1;
          } else if (diffDays > 1) {
            user.streak = 1;
          }
        }

        user.lastActiveDate = now;
        await user.save();
      }
    }

    return user;
  } catch (err) {
    throw new Error(err.message || 'Invalid or expired token');
  }
}

module.exports = verifyAuth;
