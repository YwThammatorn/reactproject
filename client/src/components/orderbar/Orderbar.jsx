import axios from "axios"
import { useState,useEffect } from "react"
import { useDebounce } from "use-debounce"
import PropTypes from 'prop-types'
import './Orderbar.css'

export default function Orderbar(props){
    const retstring = window.localStorage.getItem("orderlist")
    const orderlist = JSON.parse(retstring)
    let isfirst = true

    const [Payload, setPayload] = useState({
        searchtext:'',
        limit:10
    });

    const [Result,setResult] = useState([])

    // let resultid = "result" + props.id
    // const input = document.getElementById(props.id)
    // console.log(input)
    // input.addEventListener("mouseover",(e) => {
    //     console.log('hello')
    // })

    const [inputValue,setInputValue] = useState("")
    const [debouncedValue] = useDebounce(inputValue,500);

    const handleInputChange = async (e) => {
        // const { value } = e.target;
        // setPayload({
        //     ...Payload,
        //     searchtext: value,
        // });
        // console.log(Payload.searchtext)
        // const response = await axios.get('http://localhost:5000/api/getproduct',{params:Payload})
        // console.log(response.data)
        // setResult(response.data)
        const value = e.target.value
        setInputValue(value)
        Payload.searchtext = value
        let response = await axios.get('http://localhost:5000/api/getproduct',{params:Payload})
        setResult(response.data)
    }

    const addEvent = () => {
        let inputid = "input" + props.id
        let resultid = "result" + props.id
        const input = document.getElementById(inputid)
        input.addEventListener("click",(e) => {
            const result = document.getElementById(resultid)
            result.style.display = "block"
        })
    }

    const handleClear = (e) => {
        e.preventDefault()
        let inputid = "input" + props.id
        const input = document.getElementById(inputid)
        input.value = null

        if(orderlist[props.id] != null){
            orderlist[props.id] = null
            let string = JSON.stringify(orderlist)
            window.localStorage.setItem('orderlist',string)
        }

        let resultid = "result" + props.id
        const result = document.getElementById(resultid)
        result.style.display = "none"
    }

    const handleResultSelect = (e,name) => {
        e.preventDefault()
        let inputid = "input" + props.id
        let resultid = "result" + props.id
        let isdup = false
        const input = document.getElementById(inputid)
        const result = document.getElementById(resultid)

        let inputlist = []

        for(let i in orderlist){
            let tempid = "input" + i
            let temp = document.getElementById(tempid)
            if(temp.value == ""){
                inputlist.push(null)
            }
            else{
                inputlist.push(temp.value)
            }
        }
        for(let i in inputlist){
            if(inputlist[i] == name){
                isdup = true
            }
        }
        if(isdup == true){
            window.alert('input at index ' + props.id + ' duplicated')
        }
        else{
            input.value = name
            orderlist[props.id] = name
            // let string = JSON.stringify(orderlist)
            // window.localStorage.setItem('orderlist',string)
            result.style.display = "none"
        }
    }

    useEffect(() => {
        addEvent()
        if(orderlist[props.id] != null && isfirst == true){
            setInputValue(orderlist[props.id])
            isfirst = false
        }
    });

    
    return (
        <>
            <div className="orderbar-div">
                <input className="quantity-input"
                    type="number"
                    id={"number"+props.id}
                    defaultValue={1}
                    name="quantity"
                    placeholder="quantity"
                />
                <input
                    type="text"
                    id={"input"+props.id}
                    className="search-input"
                    placeholder="search all products"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button className="clear-button" onClick={handleClear}>X</button>
                <div className="result-div" id={"result"+props.id}>
                    {Result.map((item, index) => {
                        return (
                            <div><a className="result-a" onClick={(event) => handleResultSelect(event,item.ProductName)}>{item.ProductName}</a></div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

Orderbar.propTypes = {
    id:PropTypes.number.isRequired
}