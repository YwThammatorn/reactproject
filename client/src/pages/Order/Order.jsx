import { useState, useEffect } from "react";
import Orderbar from '../../components/orderbar/Orderbar'
import axios from 'axios'
import moment from 'moment';
import './Order.css';

export default function Order(){
    const retstring = window.localStorage.getItem('orderlist')
    const orderlist = JSON.parse(retstring)

    const [Payload,setPayload] = useState({
        Username:'defaultUser',
        OrderList:null,
        OrderQuery:null,
        OrderDate:null,
        OrderTime:null,
        Status:'Ordered'
    })

    const handleSave = (e) => {
        e.preventDefault()
        let inputlist = []
        for(let i in orderlist){
            let inputid = "input" + i
            const input = document.getElementById(inputid)
            if(input.value == ""){
                inputlist.push(null)
            }
            else{
                inputlist.push(input.value)
            }
        }
        console.log(inputlist)
        let string = JSON.stringify(inputlist)
        window.localStorage.setItem("orderlist",string)
        window.alert("Current Order Saved")

    }

    const handleSubmit = (e) => {
        let listlength = orderlist.length
        let inputlength = parseInt(document.getElementById("orderlength").value)
        let templist = []
        console.log(listlength,inputlength)
        if(listlength != inputlength){
            for(let i=0;i<inputlength;i++){
                templist.push(null)
            }
            let string = JSON.stringify(templist)
            window.localStorage.setItem("orderlist",string)
            window.location.reload()
        }
    }

    const handleOrder = async (e) => {
        e.preventDefault()
        let orderstring = ''
        for(let i in orderlist){
            let numberid = "number" + i
            let inputid = "input" + i
            let number = document.getElementById(numberid).value
            let input = document.getElementById(inputid)
            if(input.value != ""){
                orderstring += number + " - " + input.value + '\n'
            }
        }
        if(orderstring != ""){
            let orderquery = orderstring.replaceAll('\n','%0A')
            Payload.OrderList = orderstring
            Payload.OrderQuery = orderquery

            const today = new Date()
            let strdate = today.getFullYear() + "-" + String(parseInt(today.getMonth()+1)) + "-" + today.getDate()
            let strtime = moment(today).format('HH:mm')

            Payload.OrderDate = strdate
            Payload.OrderTime = strtime

            const response = await axios.post('http://localhost:5000/api/setorder',Payload)

            console.log(response)

            for(let i in orderlist){
                orderlist[i] = null
            }
            console.log(orderlist)
            window.alert("Current Order Updated In System")
            window.location.reload()
        }
        else{
            window.alert("Current Order is Empty")
        }
    }
    
    useEffect(() => {
    },[])

    return (
        <div className="container-div">
            <div className="subcontainer-div">
                <input className="quantity-input"
                    type="number"
                    id="orderlength"
                    defaultValue={5}
                    name="quantity"
                    placeholder="quantity"
                />
                <button className="submit-button" onClick={handleSubmit}>submit</button>
                {orderlist.map((item, index) => {
                    return (
                        <div className="orderlist-div" key={index}>
                            <Orderbar id={index}/>
                        </div>
                    )
                })}
                <div className="order-button-list">
                    <button className="print-button" onClick={handleSave}>save</button>
                    <button className="print-button" onClick={handleOrder}>order</button>
                </div>
            </div>
        </div>
    )
}