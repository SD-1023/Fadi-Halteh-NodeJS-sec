const express=require('express')
const { getbooks, getBookById, addBookToLibrary } = require('./functions');
const Joi = require('joi');
const { error } = require('console');
const pug = require('pug')

const app = express()
app.use(express.json())
app.set("view engine", "pug");
app.set("view cache", false);

port=3000


app.get('/books',async (req,res)=>{
    try {
        let result =await getbooks()
        // res.send(await getbooks())
        res.render('books',{result});
    } catch (err) {
       res.status(404).send(err.message) 
    }
})

app.get('/books/:id',async(req,res)=>{
    const schema = Joi.object({
        id: Joi.number().integer().positive().required(),
    });
    try {
        let {value,error}=schema.validate({id:req.params.id})
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        let result = await getBookById(value.id)
       res.render('books',{result});
        // res.send(await getBookById(value.id))
    } catch (err) {
        res.status(404).send(err.message);
    }
})

app.post('/books',async(req,res)=>{
    let bookName=req.body["name"]
    const schema =Joi.object({
        name:Joi.string().required()
    })
    try {
       let {error,value}=schema.validate({name:bookName})
       if (error) return res.status(400).json({ error: error.details[0].message });
       let book=await addBookToLibrary(value.name)
       let process = 'success'
       res.send({process, book});
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.use((req, res) => {
    res.status(404).send('404 - Not Found');
  });
  

  
app.listen(port)
