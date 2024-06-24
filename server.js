const http =require('http');
const {updatePassword,emailUser,getByToken,increaseEasyQuestionnaire,increaseMediumQuestionnaire,increaseHardQuestionnaire,getUsers, getUserById, getUserByUsername, createUser, updateUser,deleteUser, loginUser, getUserRank} =require('./controllers/userController')

const {getRandomQuestionnaires,getQuestionnaires,getQuestionnaire,createQuestionnaire, updateQuestionnaire, deleteQuestionnaire} =require('./controllers/questionnaireController')
const{getSigns, createSign,updateSign, deleteSign}=require('./controllers/signController')
const PORT = process.env.PORT || 3000


const server = http.createServer((req,res)=>{
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    else
    if(req.url == '/api/users' && req.method === 'GET'){
        getUsers(req,res)
    }
    else if(req.url === '/api/user/reset_password' && req.method === 'PUT'){
        updatePassword(req, res);
    }
    else if(req.url === '/api/user/rank' && req.method === 'GET'){
        getUserRank(req, res);
    }
    else if (req.url ==='/api/user/increase_easy_questionnaire' && req.method === 'PUT') {
        increaseEasyQuestionnaire(req, res);
    }
    else if (req.url ==='/api/user/increase_medium_questionnaire' && req.method === 'PUT') {
        increaseMediumQuestionnaire(req, res);
    }
    else if (req.url ==='/api/user/increase_hard_questionnaire' && req.method === 'PUT') {
        increaseHardQuestionnaire(req, res);
    }
    else if(req.url.match(/\/api\/user\/send_email\/(\w+)/) && req.method === 'GET'){
        const email=req.url.split('/')[4]
        emailUser(req,res,email)
    }
    else if(req.url.match(/\/api\/user\/(\w+)/) && req.method === 'GET'){
        const id=req.url.split('/')[3]
        getUserById(req,res,id);
    }
    else if(req.url.match(/\/api\/user\/(\w+)/) && req.method === 'GET'){
        const id=req.url.split('/')[3]
        getUserByUsername(req,res,username);
    }
    else if(req.url === '/api/user' && req.method === 'POST'){
        createUser(req,res)
    }
    else if(req.url.match(/\/api\/user\/(\w+)/) && req.method === 'PUT'){
        const id=req.url.split('/')[3]
        updateUser(req,res,id)
    }
    else if(req.url.match(/\/api\/user\/(\w+)/) && req.method === 'DELETE'){
        const username=req.url.split('/')[3]
        deleteUser(req,res,username)
    }
    
    else if (req.url === '/api/user/login' && req.method === 'POST') {
        loginUser(req, res);
    }
    
    else if(req.url == '/api/questionnaires' && req.method === 'GET'){
        getQuestionnaires(req,res)
    }
    else if(req.url.match(/\/api\/questionnaire\/random\/(\d+)/) && req.method === 'GET'){
        const nrOfRandomQuestionnaires=req.url.split('/')[4]
        getRandomQuestionnaires(req,res,nrOfRandomQuestionnaires)
    }
    else if(req.url.match(/\/api\/questionnaire\/(\w+)/) && req.method === 'GET'){
        const id=req.url.split('/')[3]
        getQuestionnaire(req,res,id);
    }
    else if(req.url === '/api/questionnaire' && req.method === 'POST'){
        createQuestionnaire(req,res)
    }
    else if(req.url.match(/\/api\/questionnaire\/(\w+)/) && req.method === 'PUT'){
        const id=req.url.split('/')[3]
        updateQuestionnaire(req,res,id)
    }
    else if(req.url.match(/\/api\/questionnaire\/(\w+)/) && req.method === 'DELETE'){
        const id=req.url.split('/')[3]
        deleteQuestionnaire(req,res,id)
    }
    else if (req.url === '/api/user' && req.method === 'GET') {
        getByToken(req, res);
    }
    else if(req.url === '/api/signs' && req.method === 'GET'){
        getSigns(req,res)
    }
    else if(req.url === '/api/sign' && req.method === 'POST'){
        createSign(req,res)
    }
    else if(req.url.match(/\/api\/sign\/(\w+)/) && req.method === 'PUT'){
        const title=req.url.split('/')[3]
        updateSign(req,res,title)
    }
    else if(req.url ==='/api/sign' && req.method === 'DELETE'){
        deleteSign(req,res)
    }
    else{
        res.writeHead(404, {'Content-Type': 'application/json'}),
        res.end(JSON.stringify({message: 'Route Not Found'}))
    }
    
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
