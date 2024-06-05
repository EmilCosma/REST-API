const User = require('../models/userModel')
const {getPostData} =require('../utils')
const jwt = require('jsonwebtoken');
const secretKey = 'the-most-secret-key-ever'; 

const bcrypt = require('bcrypt');
const saltRounds = 10;

// gets all users
//@route GET /api/users
async function getUsers(req,res){
    try{
        const users = await User.findAll()
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users))
    }
    catch (error){
        res.writeHead(500, { 'Content-Type': 'application/json' });
        console.log(error)
        res.end(JSON.stringify({ message: 'An error occurred' }));
    }
}
// get user by id
//@route GET /api/user/{id}
async function getUserById(req,res,id){
    try{
        const user = await User.findById(id)
        
        if(!user){
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'User not found'}));
        }
        else{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(user));
        }

        
    }
    catch (error){
        console.log(error)
    }
}

// get user by username
//@route GET /api/user/{username}
async function getUserByUsername(req,res,username){
    try{
        const user = await User.findByUsername(username)
        
        if(!user){
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'User not found'}));
        }
        else{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(user));
        }
    }
    catch (error){
        console.log(error)
    }
}

// create new user
//@route POST /api/user
async function createUser(req,res){
    try{
        const body= await getPostData(req)
        console.log(body)
        const {username, password}= JSON.parse(body)

        if (typeof username !== 'string' || typeof password !== 'string') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Bad Request: Username and password must be strings' }));
        }

        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Username is already taken' }));
            return;
        }

        bcrypt.hash(password, saltRounds, async function(err, hashedPassword) {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error hashing password' }));
                return;
            }

            const score=0;
            const easy_questionnaires=0;
            const medium_questionnaires=0;
            const hard_questionnaires=0;
            const user = {
                username,
                password: hashedPassword,
                score,
                easy_questionnaires,
                medium_questionnaires,
                hard_questionnaires
            }
            const newUser= await User.create(user)
            
            res.writeHead(201,{'Content-Type' : 'application/json'})
            return res.end(JSON.stringify({ message: 'Account created!',valid:'true' }))
        });
    }
    catch (error){
        console.log(error)
    }
}

// update a user
//@route PUT /api/user/:id
async function updateUser(req,res,id){
    try{
        const user= await User.findById(id)
        console.log(user)
        if(!user){
            res.writeHead(404, {'Content-Type': 'application/json'}),
            res.end(JSON.stringify({message: 'User not found'}))
        }
        else{
            const body= await getPostData(req)

            const {username, password, score}= JSON.parse(body)
    
            const userData = {
                username: username || user.username,
                score: score || user.score,
                password: password || user.password
            }
            const updUser= await User.update(id,userData)
    
            res.writeHead(200,{'Content-Type' : 'application/json'})
            return res.end(JSON.stringify(updUser))
        }

    }
    catch (error){
        console.log(error)
    }
}
// delete user by id
//@route DELETE /api/user/:username
    async function deleteUser(req,res,username){
        try{
            const user = await User.findByUsername(username)
            
            if(!user){
                res.writeHead(404, {'Content-Type': 'application/json'}),
                res.end(JSON.stringify({message: 'User not found'}))
            }
            else{
                await User.remove(user.id)
                res.writeHead(200, {'Content-Type': 'application/json'}),
                res.end(JSON.stringify({message: `User ${username} removed`, valid:'true'}))
            }
            
        }
        catch (error){
            console.log(error)
        }
    }
    // login user by username and password
    //@route POST /api/user/login
    async function loginUser(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const { username, password } = JSON.parse(body);
            
                // Validate the username and password
                const user = await User.findUserLogin( username, password );
                if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid username or password' }));
                    return;
                }
                
                // Generate a token
                const token = jwt.sign({ id: user.id }, secretKey);
            
                // Send the token to the client
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message:'Login successful',token: token , valid:'true'}));
            } catch (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'An error occurred' }));
            }
        });
    }

//get user rank by username
//@route GET /api/user/rank
async function getUserRank(req,res){
    
    try{
        const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Unauthorized' }));
                return;
            }

            const decoded = jwt.verify(token, secretKey);
            console.log(decoded)
            const user = await User.findById(String(decoded.id));

        if(!user){
            res.writeHead(404, {'Content-Type': 'application/json'}),
            res.end(JSON.stringify({message: 'User not found'}))
        }
        else{
            const users = await User.findAll()

            users.sort((a, b) => b.score - a.score);

            let rank = 1;

            for(let i = 0; i < users.length; i++){
                if(users[i].score > user.score){
                    rank++;
                }
            }
            console.log(rank)

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message:'Rank returned successfuly' ,rank: rank}));
        }
    }
    catch (error){
        console.log(error)
    }
}

    // increase easy_questionnaire by id
    //@route PUT /api/user/increase_easy_questionnaire/:token
    async function increaseEasyQuestionnaire(req,res){
        try{
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Unauthorized' }));
                return;
            }
            const decoded = jwt.verify(token, secretKey);
            console.log(decoded)
            const user = await User.findById(String(decoded.id));
            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
                return;
            }
            console.log(user)
            if(!user){
                res.writeHead(404, {'Content-Type': 'application/json'}),
                res.end(JSON.stringify({message: 'User not found'}))
            }
            else{
                
        
                const userData = {
                    easy_questionnaires: user.easy_questionnaires+1,
                    score: user.score+1
                }
                const updUser= await User.update(user.id,userData)
        
                res.writeHead(200,{'Content-Type' : 'application/json'})
                return res.end(JSON.stringify(updUser))
            }
            
        }
    catch (error){
        console.log(error)
    }
}
// increase easy_questionnaire by id
    //@route PUT /api/user/increase_easy_questionnaire/:id
    async function increaseMediumQuestionnaire(req,res){
        try{
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Unauthorized' }));
                return;
            }
            const decoded = jwt.verify(token, secretKey);
            console.log(decoded)
            const user = await User.findById(String(decoded.id));
            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
                return;
            }
            console.log(user)
            if(!user){
                res.writeHead(404, {'Content-Type': 'application/json'}),
                res.end(JSON.stringify({message: 'User not found'}))
            }
            else{
                
        
                const userData = {
                    medium_questionnaires: user.medium_questionnaires+1,
                    score: user.score+3
                }
                const updUser= await User.update(user.id,userData)
        
                res.writeHead(200,{'Content-Type' : 'application/json'})
                return res.end(JSON.stringify(updUser))
            }
            
        }
    catch (error){
        console.log(error)
    }
}
// increase easy_questionnaire by id
    //@route PUT /api/user/increase_easy_questionnaire
    async function increaseHardQuestionnaire(req,res){
        try{
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Unauthorized' }));
                return;
            }
            const decoded = jwt.verify(token, secretKey);
            console.log(decoded)
            const user = await User.findById(String(decoded.id));
            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
                return;
            }
            console.log(user)
            if(!user){
                res.writeHead(404, {'Content-Type': 'application/json'}),
                res.end(JSON.stringify({message: 'User not found'}))
            }
            else{
                
        
                const userData = {
                    hard_questionnaires: user.hard_questionnaires+1,
                    score: user.score+5
                }
                const updUser= await User.update(user.id,userData)
        
                res.writeHead(200,{'Content-Type' : 'application/json'})
                return res.end(JSON.stringify(updUser))
            }
            
        }
    catch (error){
        console.log(error)
    }
}

// get user by token
//@route GET /api/user
async function getByToken(req,res){
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized' }));
            return;
        }
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded)
        const user = await User.findById(String(decoded.id));
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'An error occurred' }));
    }
}


module.exports={
    getUsers,
    getUserById,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    getUserRank,
    increaseEasyQuestionnaire,
    increaseMediumQuestionnaire,
    increaseHardQuestionnaire,
    getByToken
}