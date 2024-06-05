const Questionnaire = require('../models/questionnaireModel')
const {getPostData} =require('../utils')

// gets all users
//@route GET /api/questionnaires
async function getQuestionnaires(req,res){
    try{
        const questionnaires = await Questionnaire.findAll()
        
        res.writeHead(200, {'Content-Type': 'application/json'}),
        res.end(JSON.stringify(questionnaires))
    }
    catch (error){
        res.writeHead(500, { 'Content-Type': 'application/json' });
        console.log(error)
        res.end(JSON.stringify({ message: 'An error occurred' }));
    }
}
// get questionnaire by id
//@route GET /api/questionnaire/{id}
async function getQuestionnaire(req,res,id){
    try{
        const questionnaire = await Questionnaire.findById(id)
        
        if(!questionnaire){
            res.writeHead(404, {'Content-Type': 'application/json'}),
            res.end(JSON.stringify({message: 'Questionnaire not found'}))
        }
        else{
            res.writeHead(200, {'Content-Type': 'application/json'}),
            res.end(JSON.stringify(questionnaire))
        }
    }
    catch (error){
        console.log(error)
    }
}
// create new questionnaire
//@route POST /api/questionnaire
async function createQuestionnaire(req,res){
    try{
        const body= await getPostData(req)

        const {text, option1, option2,option3,solution,image_url,hint}= JSON.parse(body)

        const questionnaire = {
            text, option1, option2,option3,solution,image_url,hint
        }

        const existingQuestionnaire = await Questionnaire.findByText(text);
        if (existingQuestionnaire) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Question is already in database' }));
            return;
        }
        
        if (typeof text !== 'string' || typeof option1 !== 'string' || typeof option2 !== 'string' || 
        typeof option3 !== 'string' || typeof solution !== 'string' || typeof image_url !== 'string' || 
        typeof hint !== 'string') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Bad Request: All fields must be string' }));
        }
        
        const newQuestionnaire= await Questionnaire.create(questionnaire)

        res.writeHead(201,{'Content-Type' : 'application/json'})
        return res.end(JSON.stringify({ message: 'New question added!', valid:'true' }))
    }
    catch (error){
        console.log(error)
    }
}
// update a questionnaire by id
//@route PUT /api/questionnaire/:id
async function updateQuestionnaire(req,res,id){
    try{
        const questionnaire= await Questionnaire.findById(id)
        console.log(questionnaire)
        if(!questionnaire){
            res.writeHead(404, {'Content-Type': 'application/json'}),
            res.end(JSON.stringify({message: 'Questionnaire not found'}))
        }
        else{
            const body= await getPostData(req)

            const {text, option1, option2,option3,solution,image_url,hint}= JSON.parse(body)
    
            const questionnaireData = {
                text: text || questionnaire.text,
                option1: option1 || questionnaire.option1,
                option2: option2 || questionnaire.option2,
                option3: option3 || questionnaire.option3,
                solution: solution || questionnaire.solution,
                image_url: image_url || questionnaire.image_url,
                hint: hint || questionnaire.hint
            }
            const updQuestionnaire= await Questionnaire.update(id,questionnaireData)
    
            res.writeHead(200,{'Content-Type' : 'application/json'})
            return res.end(JSON.stringify(updQuestionnaire))
        }

    }
    catch (error){
        console.log(error)
    }
}
// delete questionnaire by id
//@route DELETE /api/questionnaire/:text
    async function deleteQuestionnaire(req,res,text){
        try{
            const questionnaire = await Questionnaire.findByText(text)
            
            if(!questionnaire){
                res.writeHead(404, {'Content-Type': 'application/json'}),
                res.end(JSON.stringify({message: 'Questionnaire not found'}))
            }
            else{
                await Questionnaire.remove(questionnaire.id)
                res.writeHead(200, {'Content-Type': 'application/json'}),
                res.end(JSON.stringify({message: `Question ${text} removed`, valid: 'true'}))
            }
        }
        catch (error){
            console.log(error)
        }
    }
// get questionnaires randomly by the number provided
//@route GET /api/questionnaire/random/{num}
async function getRandomQuestionnaires(req, res, nrOfQuestionnaires) {
    try {

        const questionnaires=await Questionnaire.findRandomly(nrOfQuestionnaires);
        

        if (questionnaires.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'No questionnaires found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(questionnaires));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'An error occurred' }));
    }
}



module.exports = {
    getQuestionnaires,
    getQuestionnaire,
    createQuestionnaire,
    updateQuestionnaire,
    deleteQuestionnaire,
    getRandomQuestionnaires
}