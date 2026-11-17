/*const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

console.log("KEY:", process.env.OPENAI_API_KEY);*/

//console.log("ENV FILE PATH:", __dirname);

const express = require("express");

const fetch = require("node-fetch");



let cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(cors());
let mysql=require('mysql2');
require('dotenv').config();

console.log("OpenRouter Loaded:", !!process.env.OPENROUTER_API_KEY);


let db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'7815952569',
    database:'MyProject'
})



db.connect((err)=>{
    if(err){
        console.log("Not Connected to DataBase");
        return;
    }
    console.log("Database Connected");
})


let chatHistory = [];
app.post("/test-ai", async (req, res)=> {
     const interview = req.body; 

    const interviewData = [];

for (let i = 0; i < interview.questions.length; i++) {

    interviewData.push({
        question: interview.questions[i],
        answer: interview.answers[i]
    });

}


















    try {

        const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+process.env.OPENROUTER_API_KEY
            },

            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                 {
                  role:"system",
                  content:`You are an expert HR interviewer and professional interview answer evaluator.

Your task is to evaluate ALL interview questions and their corresponding candidate answers provided by the user.

You must perform TWO levels of evaluation:

LEVEL 1:
Evaluate every question and answer individually.

LEVEL 2:
After evaluating all questions, calculate and provide one combined overall interview evaluation.

==================================================
IMPORTANT GENERAL RULES
==================================================

- Evaluate every answer according to its corresponding QUESTION.
- Never evaluate an answer using a generic expected answer.
- First understand what each question is asking.
- Then determine what a good answer to THAT specific question should contain.
- Compare the candidate's actual answer with the requirements of that question.
- Do not expect exact keywords.
- Judge the meaning, quality, relevance, and completeness of the answer.
- Do not give a high score simply because the answer is grammatically correct.
- Do not give a low score simply because an answer is short if the question can reasonably be answered briefly.
- Never invent information that the candidate did not provide.
- Do not assume skills, experience, achievements, education, projects, or qualifications that are not present in the candidate's answer.
- Be fair and consistent across all questions.
- Empty or missing answers must receive 0 for all evaluation factors.
- If an answer is partially relevant, score it according to the amount and quality of relevant information actually provided.
- Do not compare one candidate answer against another candidate.
- Evaluate only the information provided.

==================================================
EVALUATION FACTORS
==================================================

Evaluate EVERY question-answer pair using these seven factors.

1. RELEVANCE — 20 marks

Evaluate whether the candidate directly answers the question.

20-17:
Directly and completely answers the question.

16-13:
Mostly answers the question but misses a small part.

12-9:
Partially answers the question.

8-5:
Mostly unrelated, vague, or unclear connection.

4-0:
Does not answer the question.

--------------------------------------------------

2. CLARITY — 15 marks

Evaluate whether the answer is understandable, logically organized, and easy to follow.

15-13:
Very clear, logical, and easy to understand.

12-10:
Mostly clear with minor confusion.

9-7:
Understandable but has noticeable confusion.

6-4:
Difficult to follow.

3-0:
Very unclear or nearly impossible to understand.

--------------------------------------------------

3. CONFIDENCE — 15 marks

Evaluate confidence expressed through the candidate's language.

15-13:
Strong, positive, and confident expression.

12-10:
Generally confident with minor hesitation.

9-7:
Neutral or somewhat hesitant.

6-4:
Frequently uncertain or negative.

3-0:
Extremely uncertain or lacks confidence.

IMPORTANT:
Do NOT claim to measure the candidate's actual psychological confidence.
Evaluate only the confidence expressed through the candidate's answer.

--------------------------------------------------

4. COMMUNICATION — 15 marks

Evaluate how effectively the candidate communicates their ideas.

15-13:
Excellent expression, flow, and sentence structure.

12-10:
Good communication with minor issues.

9-7:
Understandable but has several communication problems.

6-4:
Poor expression or difficult flow.

3-0:
Very difficult to understand.

--------------------------------------------------

5. SPECIFICITY — 15 marks

Evaluate whether the candidate provides useful details, examples, evidence, actions, or results when appropriate for the question.

15-13:
Highly specific and supported by strong details/examples.

12-10:
Provides some useful details or an example.

9-7:
Mostly general with limited details.

6-4:
Very generic.

3-0:
No meaningful supporting details.

IMPORTANT:
Do not penalize an answer simply because a specific example is unnecessary for that particular question.

--------------------------------------------------

6. PROFESSIONALISM — 10 marks

Evaluate whether the answer is appropriate for a professional interview.

10-9:
Highly professional and appropriate.

8-7:
Professional with minor issues.

6-5:
Acceptable but somewhat informal.

4-3:
Noticeably unprofessional.

2-0:
Clearly inappropriate or unprofessional.

--------------------------------------------------

7. COMPLETENESS — 10 marks

Evaluate whether the candidate covers the important aspects expected from THIS SPECIFIC QUESTION.

10-9:
Covers all important aspects.

8-7:
Covers most important aspects.

6-5:
Covers some important aspects.

4-3:
Misses many important aspects.

2-0:
Fails to meaningfully answer the question.

IMPORTANT:
Determine what aspects are important by first understanding the specific question.

Do not use the same expected answer for every question.

==================================================
INDIVIDUAL SCORE CALCULATION
==================================================

Each question has a maximum of 100 marks.

For every question:

totalScore =
relevance +
clarity +
confidence +
communication +
specificity +
professionalism +
completeness

The totalScore MUST exactly equal the sum of the seven individual scores.

Never randomly assign scores.

Every score must be supported by the candidate's actual answer.

==================================================
INDIVIDUAL FEEDBACK
==================================================

For EVERY question provide:

1. strengths:
   Mention the strongest parts of the candidate's answer.

2. improvements:
   Mention the most important things the candidate should improve.

3. feedback:
   Give a short HR-style evaluation of that specific answer.

4. suggestedAnswer:
   Provide an improved version of the candidate's answer.

IMPORTANT:
- Preserve the candidate's original meaning where possible.
- Do not invent experience, skills, education, projects, achievements, or qualifications.
- If the original answer is empty, provide a suitable example answer but clearly keep it as a suggested answer, not as information about the candidate.

5. rating:

90-100 = Excellent
80-89 = Very Good
70-79 = Good
60-69 = Average
40-59 = Needs Improvement
0-39 = Poor

==================================================
OVERALL INTERVIEW EVALUATION
==================================================

After evaluating ALL questions individually, calculate the combined interview result.

First calculate the average of all individual question totalScores.

Example:

Question 1 = 85
Question 2 = 90
Question 3 = 75
Question 4 = 80
Question 5 = 85

overallScore =
(85 + 90 + 75 + 80 + 85) / 5

Round the final overallScore to the nearest whole number.

Do NOT randomly choose the overall score.

The overall rating must use:

90-100 = Excellent
80-89 = Very Good
70-79 = Good
60-69 = Average
40-59 = Needs Improvement
0-39 = Poor

==================================================
OVERALL EVALUATION
==================================================

After calculating the overall score, provide:

1. overallScore
2. rating
3. strengths:
   Identify the candidate's strongest overall qualities across the interview.

4. improvements:
   Identify the most important areas the candidate should improve across the interview.

5. overallFeedback:
   Give a concise professional HR-style summary of the candidate's overall performance.

6. eligible:
   Set this based ONLY on the following rule:

overallScore >= 70 → true
overallScore < 70 → false

Do not change this eligibility rule.

==================================================
IMPORTANT JSON RULES
==================================================

RETURN ONLY VALID JSON.

Do not return:
- Markdown
- Code fences
- Explanations outside JSON
- Comments
- Extra text

Use exactly this structure:

{
  "evaluations": [
    {
      "questionNumber": 1,
      "question": "...",
      "answer": "...",
      "totalScore": 0,
      "rating": "...",
      "scores": {
        "relevance": 0,
        "clarity": 0,
        "confidence": 0,
        "communication": 0,
        "specificity": 0,
        "professionalism": 0,
        "completeness": 0
      },
      "strengths": [],
      "improvements": [],
      "feedback": "...",
      "suggestedAnswer": "..."
    }
  ],

  "overallEvaluation": {
    "overallScore": 0,
    "rating": "...",
    "strengths": [],
    "improvements": [],
    "overallFeedback": "...",
    "eligible": false
  }
}

==================================================
FINAL VALIDATION BEFORE RETURNING JSON
==================================================

Before returning the result, verify:

1. Every question has been evaluated.
2. Every answer has been evaluated against its corresponding question.
3. Every individual score is within its allowed range.
4. Every individual totalScore equals the sum of its seven factor scores.
5. overallScore is calculated from all individual totalScores.
6. overallScore is correctly rounded.
7. rating matches overallScore.
8. eligible follows the 70-mark rule.
9. The returned response is valid JSON.
10. Do not omit any question.`},
                 {
                  role:"user",
                  content:JSON.stringify(interviewData)
                 },
             ]
            })
        }
    );

       const data = await response.json();

       console.log("Status:", response.status);

       const result = data.choices[0].message.content;
       console.log(result);

       const cleanResult = result
            .replace(/```json/g, "")
            .replace(/```/g, "")
             .trim();

const parsedResult = JSON.parse(cleanResult);

res.json(parsedResult);

    }

    catch(error){

        console.log(error);

        res.send(error.message);
    }
});








app.post("/interview", async (req, res) => {

    try {

        const {
            candidateName,
            question,
            answer
        } = req.body;

        if (!candidateName || !question || !answer) {

            return res.status(400).json({

                error: "Missing Data"

            });

        }

        res.json({

            message: "Interview endpoint working",

            candidateName,

            question,

            answer

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            error: error.message

        });

    }

});


























































































































































app.post("/start_exam",(req,res)=>{
  const{exam_id}=req.body;
  db.query('INSERT INTO Exams(exam_id) VALUES (?)',[exam_id],(err,result)=>{
    if(err){
      console.log("Error",err);
      return;
    }
    res.send(result);
    console.log(result);
  })
})

app.post("/score_total", (req, res) => {
  const { exam_id, finalTimeTaken } = req.body;

  db.query(
    'SELECT SUM(score) AS total FROM Question_Score WHERE exam_id = ?',
    [exam_id],
    (err, result) => {
      if (err) {
        console.log("Error", err);
        return res.status(500).send(err);
      }

      const totalScore = result[0].total || 0;

      const solvedQuestions = totalScore / 10;

      db.query(
        'INSERT INTO OverAllScore (exam_id, solved_questions, total_score, time_taken) VALUES (?, ?, ?, ?)',
        [exam_id, solvedQuestions, totalScore, finalTimeTaken],
        (err2, result2) => {
          if (err2) {
            console.log("Insert Error", err2);
            return res.status(500).send(err2);
          }

          console.log("Inserted successfully");
          res.send({
            message: "Success",
            totalScore,
            solvedQuestions
          });
        }
      );
    }
  );
});

app.get("/load_questions",(req,res)=>{
  let id=req.query.id;
  db.query('SELECT Question_name,Difficulty_level,Description_1,Example,Constraints FROM ds_questions Where Question_id=?',[id],(err,result)=>{
       if(err){
        console.log("Error",err);
        return;}
        res.json(result); 
  });    })


app.get("/Final",(req,res)=>{
  let id=req.query.id;
  db.query('SELECT total_score,time_taken FROM OverAllScore WHERE exam_id=?',[id],(err,result)=>{
    if(err){
      console.log("Error",err);
      return;
    }
    res.json({result});
  });})



app.get("/Each_Question", (req, res) => {
  let id = req.query.id;

  db.query(
    `SELECT 
        qs.question_id,
        dq.Question_name,
        qs.score,
        qs.time_taken,
        qs.passed
     FROM Question_Score qs
     JOIN ds_questions dq 
     ON qs.question_id = dq.Question_id
     WHERE qs.exam_id = ?`,
    [id],
    (err, result) => {
      if (err) {
        console.log("Error", err);
        return;
      }

      res.json({ result });
    }
  );
});










app.post("/score_question", (req, res) => {

  const { question_id,exam_id,score,time,passed} = req.body;
      db.query(
        "INSERT INTO Question_Score(exam_id,question_id,score,time_taken,passed) VALUES (?, ?, ?, ?, ?)",
        [exam_id,question_id,score, time, passed],
        (err) => {
          if (err) {
            console.log(err);
            return res.send("Insert Error");
          }
          res.send("Saved successfully");
          console.log("DATA INSERTED");
        });});

















app.get("/ds_questions",(req,res)=>{
  db.query('SELECT Question_id FROM ds_questions ORDER BY RAND() LIMIT 3',(err,result)=>{
    if(err){
      console.log("Error Occured",err);
      return;
    }
    console.log("Result",result);
    res.json(result);
  })
})

app.get("/test",(req,res)=>{
   let id=req.query.id;
   db.query('SELECT Input_data,Expected_output,Question_id FROM test_cases WHERE Question_id=?',[id],(err,result)=>{
    if(err){
      console.log("Error",err);
      return;
    }
    res.json(result);
    console.log("Result",result);
   })
})


app.post("/run-java", (req, res)=> {

  const { code, question_id } = req.body;

  if (!code || !question_id) {
    return res.send("Missing code or question_id");
  }
  console.log("Question ID:", question_id);
  // ✅ FETCH TESTCASES
  db.query(
    "SELECT Input_data, Expected_output FROM Test_Cases WHERE Question_id = ?",
    [question_id],
    (err, rows) => {

      if (err) {
        console.log(err);
        return res.send("DB Error");
      }

      if (rows.length === 0) {
        return res.send("No testcases found");
      }

      console.log("Testcases:", rows);

      // ✅ WRITE JAVA FILE
      fs.writeFileSync("Main.java", code);

      // ✅ COMPILE
      exec("javac Main.java", (compileError, stdout, stderr) => {

        if (compileError) {
          console.log("Compile Error:", stderr);
          return res.send("Compile Error:\n" + stderr);
        }

        let results = [];
        let completed = 0;
        let allPassed=true;

        // ✅ RUN EACH TESTCASE
        rows.forEach((row, index) => {

        /*  const run = exec("java Main", (error, stdout, stderr) => {

            if (error) {
              results[index] = `Test Case ${index+1}: Error`;
            } else {

              let output = stdout.trim();
              let expected = row.Expected_output.trim();

              console.log(`TC${index+1} -> Output: ${output}, Expected: ${expected}`);

              if (output === expected){
                results[index] = `Test Case ${index+1}: Passed  ✅`;
              } else {
                results[index] =
                  `Test Case ${index+1}: Failed  ❌ \n  Expected:${expected},Actual:${output}`;
                  allPassed=false;
              }}
            completed++;
            // ✅ SEND FINAL RESULT
            if (completed === rows.length) {
              
              let passed = allPassed?10:0;

              res.send({
                results:results,
                score:passed
              })}
            });

          // ✅ SEND INPUT TO JAVA
              run.stdin.write(row.Input_data);
              run.stdin.end();
              run.stderr.on("data", data => {
              console.log("Java Error:", data.toString());});});});});
          });*/
          const { spawn } = require("child_process");

const run = spawn("java", ["Main"]);

let output = "";
let errorOutput = "";

run.stdout.on("data", (data) => {
  output += data.toString();
});

run.stderr.on("data", (data) => {
  errorOutput += data.toString();
});

run.on("close", () => {
  
  if (errorOutput) {
    results[index] = `Test Case ${index+1}: Error`;
    allPassed=false;
  } else {

    let out = output.trim();
    let expected = row.Expected_output.trim();

    if (out === expected) {
      results[index] = `Test Case ${index+1}: Passed ✅`;
    } else {
      results[index] =
        `Test Case ${index+1}: Failed ❌ \nExpected:${expected}, Actual:${out}`;
      allPassed = false;
    }
  }

  completed++;

  if (completed === rows.length) {
    let passed = allPassed ? 10 : 0;

    res.send({
      results: results,
      score: passed,
      allPassed:allPassed
    });
  }
});

// ✅ VERY IMPORTANT
run.stdin.write(row.Input_data + "\n");
run.stdin.end();})})})});








































































app.post("/run-python", (req, res) => {

  const { code, input } = req.body;

  fs.writeFileSync("script.py", code);

  const run = exec("python script.py", (error, stdout, stderr) => {

    if (error) {
      return res.send(stderr);
    }

    res.send(stdout);

  });

  if (input) {
    run.stdin.write(input);
  }

  run.stdin.end();
});

app.listen(3000,()=>{
  console.log("Server is Running on port 3000");
})

