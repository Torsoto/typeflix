import express from 'express';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";
import './db/firebase.mjs';
import cors from 'cors';
const app = express();
const auth = getAuth();
const db = getFirestore();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173' }));


app.post('/signup', async (req, res) => {
    try {
        const {username, email, password} = req.body;

        // Check if username already exists
        const userDoc = await getDocs(collection(db, "users"));
        let usernameExists = false;

        userDoc.forEach((doc) => {
            if (doc.data().username === username) {
                usernameExists = true;
            }
        });

        if (usernameExists) {
            console.log('Username already exists');
            res.status(401).send({error: 'Username already exists'});
        } else {
            try {
                const {username, email, password} = req.body;
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userRecord) => {
                        console.log('Successfully created new user:', userRecord.user.uid);
                        setDoc(doc(db, "users", username), {
                            username: username,
                            email: email,
                            userid: userRecord.user.uid
                        }).then(() => {
                            console.log("User data stored in Firestore");
                            res.status(200).send({uid: userRecord.user.uid});
                        }).catch((error) => {
                            console.log("Error storing user data in Firestore:", error);
                            res.status(500).send({error: error.message});
                        });

                    })
                    .catch((error) => {
                        console.log('Error creating new user:', error);
                        res.status(500).send({error: error.message});
                    });
            } catch (e) {
                res.status(500).send({error: e.message});
            }
        }
    } catch (e) {
        res.status(500).send({error: e.message});
    }
})

app.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    // First, attempt to find the user by username.
    const userDoc = await getDocs(collection(db, "users"));
    let email;

    userDoc.forEach((doc) => {
        if(doc.data().username === identifier) {
            email = doc.data().email;
        }
    });

    if (email) {
        // User found by username, attempt to sign in with their email.
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User logged in successfully");
                res.status(200).send({ uid: userCredential.user.uid });
            })
            .catch((error) => {
                console.error("Error:", error.message);
                console.error(email, password);
                res.status(400).send({ error: error.message });
            });
    } else {
        // User not found by username, attempt to sign in with the identifier as email.
        signInWithEmailAndPassword(auth, identifier, password)
            .then((userCredential) => {
                console.log("User logged in successfully");
                res.status(200).send({ uid: userCredential.user.uid });
            })
            .catch((error) => {
                console.error("Error:", error.message);
                console.error(identifier, password);
                res.status(400).send({ error: error.message });
            });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})
