const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

require('dotenv').config()

//SQL connection

const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
});

app.use(cors())
app.use(express.json())

app.get('/',(req,res) => {
    res.send('Server is working')
})

app.get('/api/test',(req,res) => {
    const page = parseInt(req.query.page)
    const per_page = parseInt(req.query.per_page)
    const startIndex = (page-1) * per_page
    var length = 0

    if((req.query.qname == null && req.query.qctg == null && req.query.qbrand == null) || (req.query.qname == "null" && req.query.qctg == "null" && req.query.qbrand == "null")){
        let sqlquery = 'SELECT COUNT(*) AS count FROM `products`'

        connection.query(
            sqlquery,[startIndex,per_page],
            (err,results) => {
                if(err == null){
                    length = results[0].count
                }
                else{
                    res.send(err)
                    console.log(err)
                }
            }
        )

        sqlquery = 'SELECT products.ProductID,products.ProductCode,products.ProductName,products.ProductKey,brands.Brand,categories.CategoryName,products.Price,products.VAT from `products`\
        INNER JOIN `brands`\
        INNER JOIN `categories`\
        WHERE brands.BrandID = products.Brand AND categories.CategoryID = products.Category\
        ORDER BY products.ProductID \
        LIMIT ?,?'

        connection.query(
            sqlquery,[startIndex,per_page],
            (err,results) => {
                if(err == null){
                    res.send({
                        results:results,
                        length:length
                    })
                }
                else{
                    res.send(err)
                    console.log(err)
                }
            }
        )
    }
    else if(req.query.qname != "null"){
        let sqlquery = 'SELECT COUNT(*) AS count FROM `products`\
        WHERE products.ProductName = \''

        sqlquery += req.query.qname + "\' "

        connection.query(
            sqlquery,[startIndex,per_page],
            (err,results) => {
                if(err == null){
                    length = results[0].count
                }
                else{
                    res.send(err)
                    console.log(err)
                }
            }
        )

        sqlquery = 'SELECT products.ProductID,products.ProductCode,products.ProductName,products.ProductKey,brands.Brand,categories.CategoryName,products.Price,products.VAT from `products`\
        INNER JOIN `brands`\
        INNER JOIN `categories`\
        WHERE brands.BrandID = products.Brand AND categories.CategoryID = products.Category AND products.ProductName = \''

        sqlquery += req.query.qname + "\' "
        sqlquery += 'ORDER BY products.ProductID \
        LIMIT ?,?'

        connection.query(
            sqlquery,[startIndex,per_page],
            (err,results) => {
                if(err == null){
                    res.send({
                        results:results,
                        length:length
                    })
                }
                else{
                    res.send(err)
                    console.log(err)
                }
            }
        )
    }
    else if(req.query.qctg != "null"){
        let sqlquery = 'SELECT COUNT(*) AS count FROM `products`\
        INNER JOIN `categories`\
        WHERE categories.CategoryID = products.Category AND categories.CategoryName = \''
        sqlquery += req.query.qctg + "\'"

        connection.query(
            sqlquery,[startIndex,per_page],
            (err,results) => {
                if(err == null){
                    length = results[0].count
                }
                else{
                    res.send(err)
                    console.log(err)
                }
            }
        )

        sqlquery = 'SELECT products.ProductID,products.ProductCode,products.ProductName,products.ProductKey,brands.Brand,categories.CategoryName,products.Price,products.VAT from `products`\
        INNER JOIN `brands`\
        INNER JOIN `categories`\
        WHERE brands.BrandID = products.Brand AND categories.CategoryID = products.Category AND categories.CategoryName = \''

        sqlquery += req.query.qctg + "\' "
        sqlquery += 'ORDER BY products.ProductID \
        LIMIT ?,?'

        connection.query(
            sqlquery,[startIndex,per_page],
            (err,results) => {
                if(err == null){
                    res.send({
                        results:results,
                        length:length
                    })
                }
                else{
                    res.send(err)
                    console.log(err)
                }
            }
        )
    }
    else if(req.query.qbrand != "null"){
        let sqlquery = 'SELECT COUNT(*) AS count FROM `products`\
        INNER JOIN `brands`\
        WHERE brands.BrandID = products.Brand AND brands.Brand = \''
        sqlquery += req.query.qbrand + "\'"

        connection.query(
            sqlquery,[startIndex,per_page],
            (err,results) => {
                if(err == null){
                    length = results[0].count
                }
                else{
                    res.send(err)
                }
            }
        )

        sqlquery = 'SELECT products.ProductID,products.ProductCode,products.ProductName,products.ProductKey,brands.Brand,categories.CategoryName,products.Price,products.VAT from `products`\
        INNER JOIN `brands`\
        INNER JOIN `categories`\
        WHERE brands.BrandID = products.Brand AND categories.CategoryID = products.Category AND brands.Brand = \''

        sqlquery += req.query.qbrand + "\' "
        sqlquery += 'ORDER BY products.ProductID \
        LIMIT ?,?'

        connection.query(
            sqlquery,[startIndex,per_page],
            (err,results) => {
                if(err == null){
                    res.send({
                        results:results,
                        length:length
                    })
                }
                else{
                    res.send(err)
                }
            }
        )
    }
})

app.get('/api/getproduct',(req,res) => {
    let sqlquery = 
    'SELECT * FROM `products`\
    WHERE ProductName LIKE \'%'
    
    sqlquery += req.query.searchtext + 
    '%\'\
    LIMIT ?'

    connection.query(
        sqlquery,parseInt(req.query.limit),
        (err,results) => {
            if(err == null){
                res.send(results)
            }
            else{
                res.send(err)
            }
        }
    )
})

app.get('/api/getctg',(req,res) => {
    let sqlquery = 'SELECT CategoryName FROM `categories`'

    connection.query(
        sqlquery,
        (err,results) => {
            if(err == null){
                res.send(results)
            }
            else{
                res.send(err)
            }
        }
    )
}) 

app.get('/api/getbrand',(req,res) => {
    let sqlquery = 'SELECT Brand FROM `brands`'

    connection.query(
        sqlquery,
        (err,results) => {
            if(err == null){
                res.send(results)
            }
            else{
                res.send(err)
            }
        }
    )
}) 

app.get('/api/getcart',(req,res) => {
    let sqlquery = 'SELECT products.ProductID,products.ProductCode,products.ProductName,products.ProductKey,brands.Brand,categories.CategoryName,products.Price,products.VAT from `products`\
    INNER JOIN `brands`\
    INNER JOIN `categories`\
    WHERE brands.BrandID = products.Brand AND categories.CategoryID = products.Category AND ProductID IN ('

    const cartlist = req.query.list
    if(cartlist == undefined){
        sqlquery += ')'
        res.send('Empty')
    }
    else{
        sqlquery += cartlist[0]
        for(let i=1;i<cartlist.length;i++){
            sqlquery += ',' + cartlist[i]
        }
        sqlquery += ')\
        ORDER BY FIND_IN_SET(ProductID,\''
        sqlquery += cartlist[0]
        for(let i=1;i<cartlist.length;i++){
            sqlquery += ',' + cartlist[i]
        }
        sqlquery += '\')'


        connection.query(
            sqlquery,
            (err,results) => {
                if(err == null){
                    res.send(results)
                }
                else{
                    res.send(err)
                }
            }
        )
    }

})

app.get('/api/getorder',(req,res) => {
    const page = parseInt(req.query.page)
    const per_page = parseInt(req.query.per_page)
    const startIndex = (page-1) * per_page
    let sqlquery = 'SELECT * FROM `orders`\
    ORDER BY OrderID DESC\
    LIMIT ?,?'
    connection.query(
        sqlquery,[startIndex,per_page],
        (err,results) => {
            if(err == null){
                res.send(results)
            }
            else{
                res.send(err)
            }
        }
    )
})

app.get('/api/getorderlength',(req,res) => {
    let sqlquery = 'SELECT COUNT(*) AS count FROM `orders`'
    connection.query(
        sqlquery,
        (err,results) => {
            if(err == null){
                res.send(results)
            }
            else{
                res.send(err)
            }
        }
    )
})

app.get('/api/getprint',(req,res) => {
    if(localStorage.getItem('date') != undefined && localStorage.getItem('time') != undefined){
        res.json({
            date:localStorage.getItem('date'),
            time:localStorage.getItem('time'),
            isfind:true
        })
    }
    else{
        res.json({
            isfind:false
        })
    }
})

app.post('/api/resetvalue',async (req,res) => {
    let sqlquery = 'ALTER TABLE `orders`\
    AUTO_INCREMENT = ?'

    let resetvalue = 10001

    connection.query(
        sqlquery,resetvalue,
        (err,results) => {
            if(err == null){
                res.send({isreset:true})
            }
            else{
                res.send({isreset:false})
            }
        }
    )
})

app.post('/api/setorder',async (req,res) => {
    let sqlquery = 'INSERT INTO `orders`(Username,OrderList,OrderQuery,OrderDate,OrderTime,Status)\
                    VALUES('
    sqlquery += '\'' + req.body.Username + '\',\''
    sqlquery += req.body.OrderList + '\',\''
    sqlquery += req.body.OrderQuery + '\',\''
    sqlquery += req.body.OrderDate + '\',\''
    sqlquery += req.body.OrderTime + '\',\''
    sqlquery += req.body.Status + '\')'

    connection.query(
        sqlquery,
        (err,results) => {
            if(err == null){
                res.send(results)
            }
            else{
                res.send(err)
            }
        }
    )

})

app.post('/api/setprint',(req,res) => {
    localStorage.setItem('order',req.body.order)
    localStorage.setItem('date',req.body.date)
    localStorage.setItem('time',req.body.time)
    res.sendStatus(200)
})

app.listen(port,() => console.log('Server started at port ' + port))




