import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from './db';

export async function getAuthUser(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'your-secret');
    
    await connectDB();
    const user = await User.findById(decoded._id).select('-password -refreshToken');
    return user;
  } catch (error) {
    return null;
  }
}
