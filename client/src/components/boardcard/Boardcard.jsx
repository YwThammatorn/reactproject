import './Boardcard.css'
import axios from "axios"
import { useEffect } from 'react'
import PropTypes from 'prop-types'

export default function Boardcard(props){

    const index = String(props.index)
    const btnid = String('#' + props.index)
    const checkStatus = (e) => {
        let status = document.getElementById(index)
        if(props.Status == "Ordered"){
            status.style.color = "deepskyblue"
        }
        else if(props.Status == "Canceled"){
            status.style.color = "red"
        }
        else if(props.Status == "Packed"){
            status.style.color = "yellow"
        }
        else if(props.Status == "Completed"){
            status.style.color = "green"
        }
    }

    const handleClick = async (e) => {
        e.preventDefault()
        let payload = {
            order:props.OrderQuery,
            date:props.OrderDate,
            time:props.OrderTime
        }
        await axios.post('http://localhost:5000/api/setprint',payload)
        let printurl = 'http://localhost:3000/print?id=' + props.OrderID + '&name=' + props.Username + '&order=' + props.OrderQuery
        let newpage = window.open(printurl)
        
        setTimeout(() => {
            newpage.print()
            // newpage.close()
        },300)
    }

    useEffect(() => {
        checkStatus()
    },[])

    return (
        <div className='boardcard-div'>
            <h3 id="id">{props.OrderID}</h3>
            <h3 id="name">{props.Username}</h3>
            <textarea id="list" className='list-textarea' disabled>{props.OrderList}</textarea>
            <h3 id="date">{props.OrderDate}</h3>
            <h3 id="time">{props.OrderTime}</h3>
            <h3 id={props.index}>{props.Status}</h3>
            <button className="print-button" id={btnid} type="button" onClick={handleClick}>print</button>
        </div>
    );
}

Boardcard.propTypes={
    OrderID:PropTypes.number.isRequired,
    Username:PropTypes.string.isRequired,
    OrderList:PropTypes.string.isRequired,
    OrderQuery:PropTypes.string.isRequired,
    OrderDate:PropTypes.string.isRequired,
    OrderTime:PropTypes.string.isRequired,
    Status: PropTypes.string.isRequired,
    index:PropTypes.number.isRequired
}