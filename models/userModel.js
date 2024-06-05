let users = require('../data/users')
const {v4: uuidv4 } = require('uuid')
const {writeDataToFile} = require('../utils') 
const bcrypt = require('bcrypt');
const { collection,getDocs, doc, getDoc ,setDoc,deleteDoc, addDoc} = require("firebase/firestore");

const db = require('../db')

function findAll(){
    return new Promise(async (resolve, reject)  => {
        try {
            const userCollection = collection(db, "Users");
            const snapshot = await getDocs(userCollection);
            const users = snapshot.docs.map(doc => doc.data());
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}
function findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDoc = doc(db, "Users", id);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          resolve({ id, ...userSnapshot.data() });
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
function create(user){
    return new Promise(async (resolve, reject) => {
        try {
          const userCollection = collection(db, "Users");
          const newUser = { ...user };
          const docRef = await addDoc(userCollection, newUser);
          resolve({ ...newUser, id: docRef.id });
        } catch (error) {
          reject(error);
        }
      });
}
function update(id, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDoc = doc(db, "Users", id);
        await setDoc(userDoc, { ...user }, { merge: true });
        resolve({ id, ...user });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  function remove(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDoc = doc(db, "Users", id);
        await deleteDoc(userDoc);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

   
  function findUserLogin(username, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const userSnapshot = await getDocs(collection(db, "Users"));
            const users = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            for (const user of users) {
                if (user.username === username) {
                    const match = await bcrypt.compare(password, user.password);
                    if (match) {
                        resolve(user);
                    } else {
                        resolve(null);
                    }
                }
            }
            resolve(null);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function getUserByUsername(username) {
    return new Promise(async (resolve, reject) => {
        try {
            const userSnapshot = await getDocs(collection(db, "Users"));
            const users = userSnapshot.docs.map(doc => doc.data());
            for (const user of users) {
                if (user.username === username) {
                    resolve(user);
                }
            }
            resolve(null);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function findByUsername(username) {
  console.log('in find by username')
    return new Promise(async (resolve, reject) => {
        try {
            const userSnapshot = await getDocs(collection(db, "Users"));
            const users = userSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }));
            for (const user of users) {
                if (user.username === username) {
                    resolve(user);
                }
            }
            resolve(null);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    findUserLogin,
    getUserByUsername,
    findByUsername
}