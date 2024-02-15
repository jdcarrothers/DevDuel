import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db } from './firebaseconfig.mjs';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

const app = express();

const corsOptions = {
  origin: '*', // or use '*' to allow all origins
};
console.log(process.env.FIREBASE_API_KEY)
app.use(cors(corsOptions));
app.use(bodyParser.json());

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

