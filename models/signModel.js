const { collection,getDocs, doc, getDoc ,setDoc,deleteDoc, addDoc} = require("firebase/firestore");

const db = require('../db')

function findAll(){
    return new Promise(async (resolve, reject)  => {
        try {
            const signCollection = collection(db, "Signs");
            const snapshot = await getDocs(signCollection);
            const signs = snapshot.docs.map(doc => doc.data());
            resolve(signs);
        } catch (error) {
            reject(error);
        }
    })
}
function create(sign){
    return new Promise(async (resolve, reject) => {
        try {
          const signCollection = collection(db, "Signs");
          const newSign = { ...sign };
          const docRef = await addDoc(signCollection, newSign);
          resolve({ ...newSign, id: docRef.id });
        } catch (error) {
          reject(error);
        }
      });
}
function findByTitle(title) {
    return new Promise(async (resolve, reject) => {
        try {
            const signSnapshot = await getDocs(collection(db, "Signs"));
            const signs = signSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }));
            for (const sign of signs) {
                if (sign.title === title) {
                    resolve(sign);
                }
            }
            resolve(null);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
function remove(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const signDoc = doc(db, "Signs", id);
        await deleteDoc(signDoc);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  function update(id, sign) {
    return new Promise(async (resolve, reject) => {
      try {
        const signDoc = doc(db, "Signs", id);
        await setDoc(signDoc, { ...sign }, { merge: true });
        resolve({ id, ...sign });
      } catch (error) {
        reject(error);
      }
    });
  }

module.exports = {
    findAll,
    create,
    findByTitle,
    remove,
    update
}