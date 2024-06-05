const { collection,getDocs, doc, getDoc ,setDoc,deleteDoc, addDoc} = require("firebase/firestore");

const db = require('../db')

function findAll(){
    return new Promise(async (resolve, reject)  => {
        try {
            const questionnaireCollection = collection(db, "Questionnaires");
            const snapshot = await getDocs(questionnaireCollection);
            const questionnaires = snapshot.docs.map(doc => doc.data());
            resolve(questionnaires);
        } catch (error) {
            reject(error);
        }
    })
}
function findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const questionnaireDoc = doc(db, "Questionnaires", id);
        const questionnaireSnapshot = await getDoc(questionnaireDoc);
        if (questionnaireSnapshot.exists()) {
          resolve(questionnaireSnapshot.data());
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

function findByText(text){
    return new Promise(async (resolve, reject)  => {
        try {
            const questionnaireSnapshot = await getDocs(collection(db, "Questionnaires"));
            const questionnaires = questionnaireSnapshot.docs.map(doc => ({
              id : doc.id,
              ...doc.data()
            }));

            for(const questionnaire of questionnaires){
              if(questionnaire.text === text){
                resolve(questionnaire);
              }
            }
            resolve(null);
        } catch (error) {
            reject(error);
        }
    });
}

function create(questionnaire){
    return new Promise(async (resolve, reject) => {
        try {
          const questionnaireCollection = collection(db, "Questionnaires");
          const newQuestionnaire = { ...questionnaire };
          const docRef = await addDoc(questionnaireCollection, newQuestionnaire);
          resolve({ ...newQuestionnaire, id: docRef.id });
        } catch (error) {
          reject(error);
        }
      });
}
function update(id, questionnaire) {
    return new Promise(async (resolve, reject) => {
      try {
        const questionnaireDoc = doc(db, "Questionnaires", id);
        await setDoc(questionnaireDoc, { ...questionnaire }, { merge: true });
        resolve({ id, ...questionnaire });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  function remove(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const questionnaireDoc = doc(db, "Questionnaires", id);
        await deleteDoc(questionnaireDoc);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  function findRandomly(nrOfQuestionnaires){
    return new Promise(async (resolve, reject)  => {
        try {
            const questionnaireCollection = collection(db, "Questionnaires");
            const snapshot = await getDocs(questionnaireCollection);
            const questionnaires = snapshot.docs.map(doc => doc.data());
            const randomQuestionnaires = [];
            for (let i = 0; i < nrOfQuestionnaires; i++) {
              const randomIndex = Math.floor(Math.random() * questionnaires.length);
              randomQuestionnaires.push(questionnaires[randomIndex]);
              questionnaires.splice(randomIndex, 1); // Remove the selected questionnaire to avoid duplicates
            }
            resolve(randomQuestionnaires)
        } catch (error) {
            reject(error);
        }
    })
  }
  
module.exports = {
    findAll,
    findById,
    findByText,
    create,
    update,
    remove,
    findRandomly
}