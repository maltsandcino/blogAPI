
import { prisma } from "../lib/prisma.ts"; 
import bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken"

const token = jwt.sign({ userId: 123 }, process.env.JWT_SECRET, { expiresIn: "1h" });

export const getUser = async (req, res) => {
  return res.json({ name: "authenticated" });
};

export const createUser = async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const password = req.body.password
    // Check if the email exists already. This has to be unique.
    const user = await prisma.user.findUnique({where: { email }});
    if (user){
        return res.status(400).json({error: "Email address already Taken."})
    }
    if (!email || !username || !password){
        return res.status(400).json({error: "You must provide a username and e-mail address"})
    }
    // Hash password
    const stored_password = await bcrypt.hash(password.trim(), 10)
    // Store result in Database

    let result;

    try {
    result = await prisma.user.create({
        data: {
            email,
            password: stored_password,
            username,
            firstname,
            lastname
        },
        select: {
            id: true,
            email: true,
            username: true
        }
    })} catch (error) {
        return res.status(500).json({error: "Some error occured creating user."})
    }
    // Generate Token now
    const token = jwt.sign(
        { id: result.id, email: result.email, username: result.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );
    return res.status(200).json({ token, user: result });
};

export const loginUser = async (req, res) => {
    const email = req.body.email;
    const result = await prisma.user.findUnique({where: { email }});
    if (!result) res.status(403).json({message: 'Incorrect username'});

    const match = await bcrypt.compare(req.body.password, result.password);
    if (!match) res.status(403).json({ message: 'Incorrect password'});

    const token = jwt.sign(
        { id: result.id, email: result.email, username: result.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );
    return res.status(200).json({ token, user: result });
};
