const { OpenAI } = require("openai");
require('dotenv').config();
const openai = new OpenAI({apiKey: `${process.env.VUE_APP_OPENAI_KEY}`});

const question = "Write a python script to find the sum of the first 10 natural numbers.";
const language = "Python";
const codeSnippet = `def sum_of_natural_numbers(n):
return (n * (n + 1)) // 2

# Calculate the sum of the first 10 natural numbers
n = 10
result = sum_of_natural_numbers(n)
print(result)`;
const expectedOutput = "55";

async function main() {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `You are tasked with evaluating the cleanliness and quality of provided code snippets. Each snippet offers a solution to a specified question. Your evaluation should focus on the code's cleanliness and overall quality, rated on a scale from 0 to 100%, where 100% signifies exceptionally clean and well-structured code. Your response must be concise and in a parsable JSON format, if the code doesnt answer the question correctly and simply hard codes the expected output, then the rating will be a 0. You must include only a rating and reasoning for that rating.

        **Question:** ${question}
        **Language:** ${language}
        **Code Snippet:**
        ${codeSnippet}
        \`\`\`
        **Expected Output:** ${expectedOutput}
        
        Please provide your assessment in the following JSON structure:
        {
          "Rating": "<Insert rating as a interager, 1 to 100>",
          "Reasoning": "<Insert concise reasoning for the given rating>"
        }`
      }]
    });
    
  console.log(completion.choices[0]);
  console.log(JSON.parse(completion.choices[0].message.content));
}

main();
