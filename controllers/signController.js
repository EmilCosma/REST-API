const Sign = require('../models/signModel')
const {getPostData} =require('../utils')

// gets all signs
//@route GET /api/signs
async function getSigns(req,res){
    try{
        const signs = await Sign.findAll()
        
        res.writeHead(200, {'Content-Type': 'application/json'}),
        res.end(JSON.stringify(signs))
    }
    catch (error){
        res.writeHead(500, { 'Content-Type': 'application/json' });
        console.log(error)
        res.end(JSON.stringify({ message: 'An error occurred' }));
    }
}

//creates a new sign
//@route POST /api/sign
async function createSign(req,res){
    try{
        const body= await getPostData(req)

        const {text,image_url,title,type}= JSON.parse(body)

        const sign = {
            text, image_url,title, type
        }
        const newSign= await Sign.create(sign)

        res.writeHead(201,{'Content-Type' : 'application/json'})
        return res.end(JSON.stringify(newSign))
    }
    catch (error){
        console.log(error)
    }
}
// delete sign by username
//@route DELETE /api/sign/:username
async function deleteSign(req,res,title){
    try{
        const sign = await Sign.findByTitle(title)
        
        if(!sign){
            res.writeHead(404, {'Content-Type': 'application/json'}),
            res.end(JSON.stringify({message: 'Sign not found'}))
        }
        else{
            await Sign.remove(sign.id)
            res.writeHead(200, {'Content-Type': 'application/json'}),
            res.end(JSON.stringify({message: `Sign ${title} removed`}))
        }

        
    }
    catch (error){
        console.log(error)
    }
}
// update a sign
//@route PUT /api/sign/title
async function updateSign(req,res,title){
    try{
        const sign = await Sign.findByTitle(title)
        console.log(sign)
        if(!sign){
            res.writeHead(404, {'Content-Type': 'application/json'}),
            res.end(JSON.stringify({message: 'Sign not found'}))
        }
        else{
            const body= await getPostData(req)

            const {title, text, image_url,type}= JSON.parse(body)
    
            const signData = {
                title: title || sign.title,
                text: text || sign.text,
                image_url: image_url || sign.image_url,
                type: type || sign.type
            }
            const updSign= await Sign.update(sign.id,signData)
    
            res.writeHead(200,{'Content-Type' : 'application/json'})
            return res.end(JSON.stringify(updSign))
        }

    }
    catch (error){
        console.log(error)
    }
}
module.exports = {
    getSigns,
    createSign,
    deleteSign,
    updateSign
}