import axios from "axios";
import { useState, useEffect } from "react";
import Card from '../../components/card/Card'
import './Home.css';

export default function Home(){
    const urlParams = new URLSearchParams(window.location.search)
    var page = urlParams.get('page')
    var per_page = urlParams.get('per_page')
    var qname = urlParams.get('qname')
    var qctg = urlParams.get('qctg')
    var qbrand = urlParams.get('qbrand')

    if(page == null){
        page = 1
    }
    if(per_page == null){
        per_page = 10
    }

    const [Payload,setPayload] = useState({
        page:page,
        per_page:per_page,
        qname:qname,
        qctg:qctg,
        qbrand:qbrand
    })

    const [numlength,setNumlength] = useState(0)

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setPayload({
            ...Payload,
            [name]: value,
        });
    }
    
    const handleChangepage = async (event,index) => {
        event.preventDefault()
        setPayload({
            ...Payload,
            page: index,
        });
        const response = await axios.get('http://localhost:5000/api/test',{params:Payload})
        setNumlength(response.data.length)
        setProducts(response.data.results)
        window.location.href = "./?page=" + index + "&per_page=" + Payload.per_page + "&qctg=" + qctg + "&qname=" + qname + "&qbrand=" + qbrand 
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await axios.get('http://localhost:5000/api/test',{params:Payload})
        setNumlength(response.data.length)
        setProducts(response.data.results)
        let retstring = window.localStorage.getItem('cartlist')
        let cartlist = JSON.parse(retstring)
        cartlist = []
        let string = JSON.stringify(cartlist)
        window.localStorage.setItem('cartlist',string)
        window.location.href = "./?page=" + Payload.page + "&per_page=" + Payload.per_page

    }

    const [products,setProducts] = useState([])

    const buttonlist = []
    var numpage = Math.ceil(numlength/per_page)

    for(let i=0;i<numpage;i++){
        buttonlist.push(<li><button id={"list"+i} className="page-button" onClick={(event) => handleChangepage(event,i+1)}>{i+1}</button></li>)
    }

    async function getProducts(){
        const response = await axios.get('http://localhost:5000/api/test',{params:Payload})
        console.log(response.data)
        setNumlength(response.data.length)
        setProducts(response.data.results)
    }

    const currentPage = () => {
        let query = "list" + (page-1)
        if(buttonlist.length == numpage && numpage != 0){
            const list = document.getElementById(query)
            list.style.color = "lime"
        }  
    }
    
    useEffect(() => {
        getProducts()
    },[])

    useEffect(() => {
        currentPage()
    },[numlength])

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
                        <div key={index}>
                            <Card 
                                ProductID={item.ProductID}
                                ProductCode={item.ProductCode}
                                ProductName={item.ProductName}
                                ProductKey={item.ProductKey}
                                Brand={item.Brand}
                                Category={item.CategoryName}
                                Price={item.Price}
                                VAT={item.VAT}
                            />
                        </div>
                    )
                })}
                <div className="buttons-list">{buttonlist}</div>
                <div className="numpage-div">
                    <input
                        type="number"
                        id="per_page"
                        name="per_page"
                        value={Payload.per_page}
                        placeholder="Input per page number"
                        onChange={handleChange}
                    />
                    <button onClick={handleSubmit}>submit</button>
                </div>
            </div>
        </div>
    )
}