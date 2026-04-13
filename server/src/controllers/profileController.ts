import { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest } from "../middleware/authMiddleware";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, full_name")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { data: analyses, error: analysesError } = await supabase
      .from("analyses")
      .select("score")
      .eq("user_id", userId);

    if (analysesError) {
      res.status(500).json({ error: analysesError.message });
      return;
    }

    const totalAnalyses = analyses.length;

    const averageScore =
      totalAnalyses === 0
        ? 0
        : Math.round(
            analyses.reduce((sum, analysis) => sum + analysis.score, 0) /
              totalAnalyses,
          );

    res.status(200).json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      totalAnalyses,
      averageScore,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { full_name } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (typeof full_name !== "string") {
      res.status(400).json({ error: "Full name is required" });
      return;
    }

    const trimmedName = full_name.trim();

    if (trimmedName.length === 0) {
      res.status(400).json({ error: "Full name cannot be empty" });
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .update({ full_name: trimmedName })
      .eq("id", userId)
      .select("id, email, full_name")
      .single();

    if (error || !data) {
      res
        .status(500)
        .json({ error: error?.message || "Failed to update profile" });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: data,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
