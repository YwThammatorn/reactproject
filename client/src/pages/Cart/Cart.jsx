import axios from "axios";
import { useState, useEffect } from "react";
import Cartcard from '../../components/cartcard/Cartcard'
import moment from 'moment'
import './Cart.css';

export default function Cart(){
    const retstring = window.localStorage.getItem('cartlist')
    const cartlist = JSON.parse(retstring)

    const [Payload,setPayload] = useState({
        list:[],
    })

    const [Order,setOrder] = useState({
        Username:'defaultUser',
        OrderList:'',
        OrderQuery:'',
        OrderDate:'',
        OrderTime:'',
        Status:'Ordered',
    })

    const [products,setProducts] = useState([])
    async function getProductscart(){
        const response = await axios.get('http://localhost:5000/api/getcart',{params:Payload})
        if(response.data == 'Empty'){
            setProducts([])
        }
        else{
            setProducts(response.data)
        }
    }

    const handleOrder = async (e) => {
        e.preventDefault()
        let Orderstring = ''
        for(let i in products){
            let temp = '#'+i
            Orderstring += document.getElementById(temp).value + ' - '
            Orderstring += products[i].ProductName + '\n'
        }

        Order.OrderList = Orderstring
        let OrderQuery = Orderstring.replaceAll('\n','%0A') 
        Order.OrderQuery = OrderQuery


        const today = new Date()
        let strdate = today.getFullYear() + "-" + String(parseInt(today.getMonth()+1)) + "-" + today.getDate()
        let strtime = moment(today).format('HH:mm')

        Order.OrderDate = strdate
        Order.OrderTime = strtime

        const response = await axios.post('http://localhost:5000/api/setorder',Order)
        if(response.data != null){
            window.alert('Your order is registered in the system')
            console.log('Database Updated!')
            let cartlist = []
            let string = JSON.stringify(cartlist)
            window.localStorage.setItem('cartlist',string)
            window.location.href = '/'
        }
       
        // var jsxprint = (
        //     <html>
        //         <head>
        //             <title>{document.title}</title>
        //         </head>
        //         <body>
        //             <div id='card-print-div'>
        //                 <h4 style={{color:'brown'}}>*** Trungruang Line Order Booking***</h4>
        //                 <h3 id="id">Booking ID: {props.id}</h3>
        //                 <h3 id="username">Line: {props.username}</h3>
        //                 <textarea id="order" disabled>{props.order}</textarea>
        //                 <h3 id="date">Booking Date: {props.date}</h3>
        //                 <h3 id="time">Booking Time: {props.time}</h3>
        //             </div>
        //         </body>
        //     </html>
        // )
        // var htmlprint = renderToStaticMarkup(jsxprint)
        // // const newpage = window.open()
        // // newpage.document.open();
        // // newpage.document. = htmlprint;
        // // newpage.document.close();
        // var old_str = document.body.innerHTML;
        // document.body.innerHTML = htmlprint;
        // window.print();
        // console.log("After print")
        // document.body.innerHTML = old_str;
        // document.location.reload()
    }
    
    useEffect(() => {
        if(cartlist.length > 0){
            Payload.list = cartlist
        }
        getProductscart()
    },[])

    return (
        <div className="container-div">
            <div className="subcontainer-div">
            <ul className="home-title-list">
                <li>ID</li>
                <li>Code</li>
                <li>Name</li>
                <li>Key</li>
                <li>Brand</li>
                <li>Category</li>
                <li>Price</li>
                <li>VAT</li>
            </ul>
                {products.map((item, index) => {
                    return (
                        <div className="cart-div" key={index}>
                            <Cartcard 
                                ProductID={item.ProductID}
                                ProductCode={item.ProductCode}
                                ProductName={item.ProductName}
                                ProductKey={item.ProductKey}
                                Brand={item.Brand}
                                Category={item.CategoryName}
                                Price={item.Price}
                                VAT={item.VAT}
                            />
                            <input className="quantity-input"
                                type="number"
                                id={"#"+index}
                                defaultValue={1}
                                name="quantity"
                                placeholder="quantity"
                            />
                        </div>
                    )
                })}
                <button className="print-button" onClick={handleOrder}>order</button>
            </div>
        </div>
    )
}