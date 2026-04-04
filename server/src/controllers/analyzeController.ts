import { Response } from "express";
import Groq from "groq-sdk";
import { AuthRequest } from "../middleware/authMiddleware";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

export const analyzeResume = async (req: AuthRequest, res: Response) => {
    try {
        const { resume, jobDescription } = req.body;
    
    //1. validate inputs
    if(!resume || !jobDescription) {
        res.status(400).json({error: "Resume and job description are required" });
        return;
    }

    //2.  build prompt
    const prompt = `You are a professional career coach and resume expert. Analyze the following resume against the job description.

    RESUME:
    ${resume}

    JOB DESCRIPTION:
    ${jobDescription}

    Rules: 
    - Be specific and actionable in your feedback
    - Score should reflect how well the resume matches the job
    - Provide atleast 2 items for each array
    - Keep each item concise (max 2 sentences)

    You MUST respond with ONLY a valid JSON object, no other text:
    {
        "score": <number between 0-100>,
        "strengths": [<array of strings>],
        "weaknesses": [<array of strings>],
        "suggestions": [<array of strings>]
    }`;

    //3. Call Groq API
    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
    });
    
    //4. extract response
    const content = completion.choices[0].message.content;

    //5. parse JSON
    const jsonMatch = content!.match(/\{[\s\S]*\}/);
    if(!jsonMatch) {
        res.status(500).json({ error: "AI returned a invalid response. Please try again."})
        return;
    }
    
    const result = JSON.parse(jsonMatch[0]);

    res.status(200).json(result);
    } catch (err) {

    res.status(500).json({ error: "Analysis failed. Please try again." });
    }
};