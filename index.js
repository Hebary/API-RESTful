
const fs = require('fs')

const express = require('express')
const Container = require("./container.js")
const { Router } = express


const app = express()
const router = Router()

//Instance of class Products
const products = new Container('products')

router.use(express.json())
router.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

const PORT = process.env.PORT || 8080

router.get("/new", (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})


//-------Get Products and save them on products array-------->

const bufferReader = async () => {
    const data = await fs.promises.readFile('products.json','utf-8')
    const productsArray = JSON.parse(data)  

    productsArray.forEach(product => products.save(product))
}
bufferReader()

//--------API REST---------

router.get('/', (req, res) => {
    res.send(products.getAll())
})
//GET ONE 
router.get('/:id', (req, res) => {
    const id = req.params.id
    const product = products.getById(id)
    const error = new Error('Product not found')
    product ? res.json(product) 
    : res.json({ error: error.message })
})

//POST for POSTMAN
router.post('/', auth, (req, res) => {
    const product = req.body
    products.save(product)
    res.send(product)    
})

//POST form
router.post('/save', auth, (req, res) => {

    const { name, price, thumbnail } = req.body
    
    const product = {
        name,
        price:Number(price),
        thumbnail
    }
    products.save(product)
    res.json(product)
})

//PUT
router.put('/:id', (req, res) => {
    const id = req.params.id
    const product = req.body
    
    if(!products.getById(id)){
        const error = new Error('Product not found')
        res.json({ error: error.message })
        return
    }
    if(!product){
        const error = new Error('Product not found')
        return res.status(404).json({ error: error.message })
    }
    const updatedProduct = products.updateOne(id, product)
    res.json(updatedProduct)
})

//DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id
    if(!products.getById(id)){
        const error = new Error('Product not found')
        return res.status(404).json({ error: error.message })
    }
    products.deleteOne(id)
    res.json(products.getAll())
})


// ---------------------Middleware --------------------
    function auth(req, res, next) {
        if(req.body.name !== "" && req.body.thumbnail !== "" && req.body.price !== "") {
            next() //acceso a la ruta y a listar
        } else{
            const error= new Error(`Error : Missing data, please complete all fields`)
            error.httpStatusCode = 404
            return next(error)
    }
}


app.use('/api/products', router)

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

server.on('error', (err) => {
    console.log(err)
})

