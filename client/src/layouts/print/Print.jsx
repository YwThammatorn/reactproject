import axios from 'axios'
import { useState,useEffect } from 'react'
import barcodeurl from './qrcode.png'
import './Print.css'

export default function Print(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    const username = urlParams.get('name')
    const order = urlParams.get('order')
    const [date,setDate] = useState('')
    const [time,setTime] = useState('')

    async function getPrint(){
        const response = await axios.get('http://localhost:5000/api/getprint')
        console.log(response.data)
        if(response.data.isfind){
            setDate(response.data.date)
            setTime(response.data.time)
        }
        setTimeout(() => {
            let textorder = document.getElementById('printorder')
            textorder.innerHTML = order
            textorder.style.height = 'auto';
            textorder.style.height = textorder.scrollHeight + 'px';
        },100)
    }

    getPrint()
    
    return (
        <div>
            <div id='card-print-div'>
                <p id='title'>*** SomeShop Line Order Booking ***</p>
                <div id='header'>
                    <div id='left-header'>
                        <p id="printid">{id}</p>
                    </div>
                    <div id='right-header'>
                        <p id="printdate">Date: {date}</p>
                        <p id="printtime">Time: {time}</p>
                    </div>
                </div>
                <p id="printname">Line: {username}</p>
                <textarea id="printorder" disabled></textarea>
                <p>----------------------------------------------</p>
                <p id="script">
                    1 Nakhon Pathom Rd <br/> 
                    Dusit, Dusit District <br/>
                    Bangkok zip 10300 <br/>
                    Tel:012-2456789 Thank You
                </p>
                <img id='img' src={barcodeurl} alt='bot_barcode'/>
            </div>
        </div>
    )
}