import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db } from '../firebaseconfig.mjs';
import { collection, addDoc, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import axios from 'axios';
const app = express();

const corsOptions = {
  origin: '*', // or use '*' to allow all origins
};
console.log(process.env.FIREBASE_API_KEY)
console.log(process.env.VUE_APP_OPENAI_API_KEY)
app.use(cors(corsOptions));
app.use(bodyParser.json());


app.post('/evaluate-code', async (req, res) => {
    try {
        const { question, language, codeSnippet, expectedOutput } = req.body;
        const prompt = `
            You're tasked with evaluating the cleanliness and quality of provided code snippets. Each snippet represents a solution to a given question. Your role is to assess the code's cleanliness on a scale from 0 to 100%, where 100% represents code that is exceptionally clean and well-structured.

            **Question:** ${question}
            **Language:** ${language}
            **Code Snippet:**
            \`\`\`${language}
            ${codeSnippet}
            \`\`\`
            **Expected Output:** ${expectedOutput}
            **Rating:** <Provide rating as a percentage>
            **Reasoning:** <Provide reasoning for the rating>
            <json>
        `;

        const response = await axios.post('https://api.openai.com/v1/completions', {
            prompt,
            max_tokens: 150,
            stop: ['<json>'],
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            model: 'text-davinci-003'
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Assuming OpenAI's response includes a line for rating and a line for reasoning
        const lines = response.data.choices[0].text.trim().split('\n');
        const codeRatingLine = lines.find(line => line.startsWith('**Rating:**'));
        const reasonLine = lines.find(line => line.startsWith('**Reasoning:**'));

        const codeRating = codeRatingLine ? codeRatingLine.split('**Rating:**')[1].trim() : 'Unknown';
        const reason = reasonLine ? reasonLine.split('**Reasoning:**')[1].trim() : 'No reasoning provided';

        res.json({ codeRating, reason });
    } catch (error) {
        console.error('Error in /evaluate-code:', error);
        res.status(500).send(error.toString());
    }
});

app.post('/updateDB', async (req, res) => {
    try {
        const{username , newCodeRating} = req.body;
        const userRef = doc(db, "Users", username);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists) {
            return res.status(404).send({ message: "User not found" });
        } 
        const userData = userDoc.data();
        let {codeRating, gamesPlayed} = userData.Stats;
        if (codeRating === 0 || gamesPlayed === 0) {
            codeRating = newRating;
            gamesPlayed = 1;
        }
        else 
        {
            gamesPlayed += 1;
            codeRating = codeRating + newCodeRating;
            codeRating = codeRating / gamesPlayed;
        }
        await userRef.update({
            'stats.codeRating': codeRating,
            'stats.gamesPlayed': gamesPlayed
        });
        
        res.status(200).send({ message: "User stats updated", codeRating, gamesPlayed });
    } catch (e) {
        res.status(500).send({ message: "Error updating user code quality", error: e.message });
    }
}
);

app.post('/adduser', async (req, res) => {
    try {
        const userData = req.body;
        const emailExists = await checkEmailExists(userData.email);
        if (emailExists) {
            return res.status(400).send({ message: "Email already exists" });
        }
        const usernameExists = await checkUsernameExists(userData.username);
        if (usernameExists) {
            return res.status(400).send({ message: "Username already exists" });
        }
        const docRef = await addDoc(collection(db, "Users"), userData);
        const userStatsRef = collection(db, `Users/${docRef.id}/Stats`);
        const userStatsSnapshot = await getDocs(userStatsRef);
        const initaluserstats ={
            "codeRating": 0.0,
            "gamesPlayed": 0,
            "Wins": 0,
        }
        if (userStatsSnapshot.empty) {
            await addDoc(userStatsRef, { initaluserstats });
        }
        res.status(200).send({ message: "User added", id: docRef.id });

    } catch (e) {
        res.status(500).send({ message: "Error adding user", error: e.message });
    }
});

async function checkEmailExists(email) {
    try {
        const querySnapshot = await getDocs(query(collection(db, "Users"), where("email", "==", email)));
        return !querySnapshot.empty;
    } catch (e) {
        console.error("Error checking email existence: ", e);
        return false;
    }
}

async function checkUsernameExists(username) {
    try {
        const querySnapshot = await getDocs(query(collection(db, "Users"), where("username", "==", username)));
        return !querySnapshot.empty;
    } catch (e) {
        console.error("Error checking username existence: ", e);
        return false;
    }
}

async function checkPasswordMatches(password, username) {
    try {
        console.log('attempting login');
        const querySnapshot = await getDocs(query(collection(db, "Users"), where("username", "==", username), where("password", "==", password)));
        return !querySnapshot.empty; // Returns true if user exists, otherwise false
    } catch (error) {
        console.error('Error finding user:', error.message);
        return false; // Return false if there's an error
    }
}
async function getUserStats(username) {
    try {
        const querySnapshot = await getDocs(query(collection(db, "Users"), where("username", "==", username)));
        if (!querySnapshot.empty) {

            const userStatsRef = collection(db, `Users/${querySnapshot.docs[0].id}/Stats`);
            const userStatsSnapshot = await getDocs(userStatsRef);
            if (!userStatsSnapshot.empty) {
                console.log(userStatsSnapshot.docs[0].data());
                return userStatsSnapshot.docs[0].data();
               
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (e) {
        console.error("Error retrieving user stats: ", e.message);
        return null;
    }
}

app.post('/login', async (req, res) => {
    try {
        const userData = req.body;
        const passwordMatches = await checkPasswordMatches(userData.password, userData.username);

        if (passwordMatches) {
            res.status(200).send({ message: "Correct username and password" });
        } else {
            res.status(401).send({ message: "Incorrect username and/or password" });
        }
    } catch (e) {
        res.status(500).send({ message: "Error logging in user", error: e.message });
    }
});

app.post('/requestStats', async (req, res) => {
    try {
        const userData = req.body;
        const userStats = await getUserStats(userData.username);
        res.status(200).send({ message: "User stats retrieved", stats: userStats });
    } catch (e) {
        res.status(500).send({ message: "Error retrieving user stats", error: e.message });
    }
});


const PORT = 2000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// for (let i = 0; i < 1000; i++) {
//     try {
//       const docRef = await addDoc(collection(db, "users"), {
//         first: "Ada",
//         last: "Lovelace",
//         born: 1815
//       });
//       console.log("Document written with ID: ", docRef.id);
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }
// }

