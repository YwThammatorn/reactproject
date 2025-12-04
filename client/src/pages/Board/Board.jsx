import axios from "axios";
import { useState, useEffect } from "react";
import Boardcard from '../../components/boardcard/Boardcard'
import './Board.css';

export default function Board(){
    const urlParams = new URLSearchParams(window.location.search)
    var page = urlParams.get('page')
    var per_page = urlParams.get('per_page')
    const buttonlist = []

    const [products,setProducts] = useState([])
    const [numorder,setNumorder] = useState(0)

    if(page == null){
        page = 1
    }
    if(per_page == null){
        per_page = 10
    }

    const [Payload,setPayload] = useState({
        page:page,
        per_page:per_page
    })

    async function getOrder(){
        const response = await axios.get('http://localhost:5000/api/getorder',{params:Payload})
        setProducts(response.data)
    }

    async function getLength(){
        const response = await axios.get('http://localhost:5000/api/getorderlength')
        console.log(response.data)
        setNumorder(response.data[0].count)
    }

    const handleChangepage = async (event,index) => {
        event.preventDefault()
        console.log(index)
        setPayload({
            ...Payload,
            page: index,
        });
        console.log(Payload)
        const response = await axios.get('http://localhost:5000/api/getorder',{params:Payload})
        console.log(response.data)
        setProducts(response.data)
        window.location.href = "./board?page=" + index + "&per_page=" + Payload.per_page
    }

    const handleReset = async (e) => {
        e.preventDefault()
        const response = await axios.post('http://localhost:5000/api/resetvalue')
        if(response.data.isreset == true){
            window.alert('Auto Increment variable adjusted')
        }
        else{
            window.alert('Auto Increment adjusting Error')
        }
    }

    getLength()
    var numpage = Math.ceil(numorder/per_page)
    for(let i=0;i<numpage;i++){
        buttonlist.push(<li><button className="page-button" onClick={(event) => handleChangepage(event,i+1)}>{i+1}</button></li>)
    }

    useEffect(() => {
        getOrder()
    },[])

    return (
        <div className="container-div">
            <div className="subcontainer-div">
            <ul className="board-title-list">
                <li>OrderID</li>
                <li>Username</li>
                <li>Order</li>
                <li>Date</li>
                <li>Time</li>
                <li>Status</li>
                <li><button className="reset-button" onClick={handleReset}>reset increment</button></li>
            </ul>
                {products.map((item, index) => {
                    return (
                        <div key={index}>
                            <Boardcard 
                                OrderID={item.OrderID}
                                Username={item.Username}
                                OrderList={item.OrderList}
                                OrderQuery={item.OrderQuery}
                                OrderDate={item.OrderDate}
                                OrderTime={item.OrderTime}
                                Status={item.Status}
                                index={index}
                            />
                        </div>
                    )
                })}
                <div className="buttons-list">{ buttonlist.length == 1 ? <div></div> : buttonlist}</div>
                {/* <div className="buttons-list">{buttonlist}</div>
                <div>
                    <input
                        type="number"
                        id="per_page"
                        name="per_page"
                        value={Payload.per_page}
                        placeholder="Input per page number"
                        onChange={handleChange}
                    />
                </div>
                <button onClick={handleSubmit}>submit</button> */}
            </div>
        </div>
    )
}