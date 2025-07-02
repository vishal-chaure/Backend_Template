import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const register = async (req, res) => {
     try {
          const { name, email, password , role} = req.body;

          if(!name || !email || !password){
               return res.status(400).json({ message : "Email, Name Or Password required"})
          }

          if(password.length < 6){
               return res.status(400).json({ message : "Password must be at least 6 characters long"});
          }

          if(role !== 'user' && role !== 'admin'){
               return res.status(400).json({ message : "Invalid role"});
          }

          const [existingUser] = await pool.execute(
               'select * from users where email = ?', [email]
          )

          if(existingUser.length > 0){
               return res.status(400).json({ message : "User already exists"});
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const userRole = role === 'admin' ? 'admin' : 'user';

          const [result] = await pool.execute(
               "insert into users (name, email, password, role) values (?, ?, ?, ?)", 
               [name, email, hashedPassword, userRole]
          )

          const token = jwt.sign(
               {id: result.insertId, email, role: userRole},
               process.env.JWT_SECRET,
               {expiresIn: '24h'}
          )

          res.status(201).json({
               message: "User registered successfully",
               token,
               user:{
                    id: result.insertId, 
                    name,
                    email, 
                    role: userRole,
               }
          })
     } catch (error) {
          res.status(500).json({
               message: "Internal server error in Register",
               error: error.message
          })
     }

}


const login = async (req, res) => {
     try {
          const { email, password, role } = req.body;

          if(!email || !password){
               return res.status(400).json({ message : "Email and Password required"})
          }

          if(password.length < 6){
               return res.status(400).json({ message : "Password must be at least 6 characters long"});
          }

          if(role !== 'user' && role !== 'admin'){
               return res.status(400).json({ message : "Invalid role"});
          }

          const [users] = await pool.execute(
               'select id, name, email, role, password from users where email = ?', [email]
          )

          if(users.length === 0){
               return res.status(404).json({ message : "User Not Found"});
          }

          const user = users[0];

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if(!isPasswordValid){
               return res.status(401).json({ message : "Invalid password"});
          }

          const token = jwt.sign(
               {id: user.id, email: user.email, role: user.role},
               process.env.JWT_SECRET,
               {expiresIn: '24h'}
          )

          res.status(200).json({
               message: "Login successful",
               token,
               user:{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
          }
     })
     } catch (error) {
          res.status(500).json({
               message: "Internal server error in Login",
               error: error.message
          })
     }
     
}

const getProfile = async (req, res) => {
     try {
          const userId = req.user.id;

          const [users] = await pool.execute(
               'select id, name, email, role from users where id = ?', [userId]
          )

          if(users.length === 0){
               return res.status(404).json({ message : "User Not Found"});
          }

          res.status(200).json({
               message: "Profile fetched successfully",
          })
     } catch (error) {
          res.status(500).json({
               message: "Internal server error in Get Profile",
               error: error.message
          })
     }
}

export { register, login, getProfile };