import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/authMiddleware";

//Save analysis
export const saveAnalysis = async (req: AuthRequest, res: Response) => {
    try {
        const {
            resume,
            jobDescription,
            score,
            skills_score,
            experience_score,
            education_score,
            strengths,
            weaknesses,
            suggestions,
            keywords_match,
            keywords_missing,
            summary,
        } = req.body;

        //1. validate inputs 
        if (!resume || !jobDescription || !score) {
            res.status(400).json({ error: "Missing required fields" });
            return;
       }
        
       //2. save to supabase
       const { data, error } = await supabase
       .from("analyses")
       .insert([
        {
            user_id: req.userId,
            resume,
            job_description: jobDescription,
            score,
            skills_score,
            experience_score,
            education_score,
            strengths,
            weaknesses,
            suggestions,
            keywords_match,
            keywords_missing,
            summary,
       },
    ])
        .select()
        .single();

        if(error) {
            res.status(400).json({ error: error.message });
            return;
        }
        
        res.status(201).json({ message: "Analysis Saved!", analysis: data});
    }   catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get History
export const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        //1. get all analyses for this user
        const { data , error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", req.userId)
        .order("created_at", {ascending: false });

        if(error) {
            res.status(400).json({ error: error.message})
            return;
        } 
        res.status(200).json({ history: data });
    }   catch(err) {
        res.status(500).json({ error: "Internal server error"});
    }
        };

//Delete an analysis
export const deleteAnalysis = async(req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        //Security check: make sure the analysis belongs to the logged-in user
        const{error} = await supabase
        .from("analyses")
        .delete()
        .eq("id", id)
        .eq("user_id", req.userId);

        if(error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: "Analysis deleted successfully"});
    }   catch(err) {
        res.status(500).json({ error: "Internal server error"});
    }
};

    






