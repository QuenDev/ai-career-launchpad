import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";

//SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //1. check if fields are provided
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    //2. hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    //3. save user to supabase
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password: hashPassword }])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json({ message: "User Created successfully", user: data });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //1.  check if fields are provided
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    //2. find user in supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    //3. compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    //4. create jwt token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      res.status(400).json({ error: "Access token is required" });
      return;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user || !user.email) {
      res.status(401).json({ error: "Invalid Google session" });
      return;
    }

    let dbUser = null;

    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (findError) {
      res.status(500).json({ error: findError.message });
      return;
    }

    if (existingUser) {
      dbUser = existingUser;
    } else {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            email: user.email,
            password: null,
          },
        ])
        .select()
        .single();

      if (insertError) {
        res.status(500).json({ error: insertError.message });
        return;
      }

      dbUser = newUser;
    }

    const token = jwt.sign(
      { userId: dbUser.id, email: dbUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      token,
      user: {
        id: dbUser.id,
        email: dbUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
