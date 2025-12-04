import './Card.css'
import axios from "axios"
import { useEffect } from 'react'
import PropTypes from 'prop-types'

export default function Card(props){
    let retstring = window.localStorage.getItem('cartlist')
    let cartlist = JSON.parse(retstring)

    const handleCart = (event,index) => {
        event.preventDefault()
        if(window.location.pathname == '/'){
            let count = false
            for(let i in cartlist){
                if(cartlist[i] == index){
                    count = true 
                }
            }
            if(count == true){
                window.alert("Product Already in Cart")
            }
            else{
                cartlist.push(index)
                console.log(cartlist)
                let string = JSON.stringify(cartlist)
                console.log(string)
                localStorage.setItem("cartlist", string)
            }
        }
        else if(window.location.pathname == '/cart'){
            let retstring = window.localStorage.getItem('cartlist')
            let cartlist = JSON.parse(retstring)
            for(let i in cartlist){
                if(cartlist[i] == index){
                    cartlist.splice(i,1)
                    break
                }
            }
            console.log(cartlist)
            let string = JSON.stringify(cartlist)
            console.log(string)
            localStorage.setItem("cartlist", string)
        }
        window.location.reload()
    }

    useEffect(() => {
        if(window.location.pathname == '/'){
            for(let ele of cartlist){
                let temp = document.getElementById(ele)
                if(temp != null){
                    temp.disabled = true
                }
            }
            Array.from(document.getElementsByClassName('cart-button'))
                .forEach(b => b.innerHTML = 'add to cart')
        }
        else if(window.location.pathname == '/cart'){
            Array.from(document.getElementsByClassName('cart-button'))
                .forEach(b => b.innerHTML = 'delete')
        }
    },[])

    return (
        <div className='card-div'>
            <h3 id="id">{props.ProductID}</h3>
            <h3 id="code">{props.ProductCode}</h3>
            <h3 id="name">{props.ProductName}</h3>
            <h3 id="key">{props.ProductKey}</h3>
            <h3 id="brand">{props.Brand}</h3>
            <h3 id="category">{props.Category}</h3>
            <h3 id="price">{props.Price}</h3>
            <h3 id="vat">{props.VAT}</h3>
            <button id={props.ProductID} className="cart-button" onClick={(event) => handleCart(event,props.ProductID)}>-default-</button>
        </div>
    );
}

Card.propTypes={
    ProductID:PropTypes.number.isRequired,
    ProductCode:PropTypes.string.isRequired,
    ProductName:PropTypes.string.isRequired,
    ProductKey:PropTypes.string.isRequired,
    Brand:PropTypes.string.isRequired,
    Category: PropTypes.string.isRequired,
    Price: PropTypes.string.isRequired,
    VAT:PropTypes.number.isRequired,
}