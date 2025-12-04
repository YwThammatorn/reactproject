import axios from "axios"
import { useState,useEffect } from "react"
import { useDebounce } from "use-debounce"
import './Searchbar.css'

const Searchbar = () => {
    const [Payload, setPayload] = useState({
        searchtext:'',
        limit:5
    });

    const [Result,setResult] = useState([])
    const [Category,setCategory] = useState([])
    const [Brand,setBrand] = useState([])

    function addevent(){
        let inputid = "searchbar"
        const searchbar = document.getElementById(inputid)

        let resultid = "result"
        const result = document.getElementById(resultid)

        searchbar.addEventListener("mouseout",() => {
            result.style.display = "none"
        })
        
        searchbar.addEventListener("mouseover",() => {
            result.style.display = "block"
        })

        searchbar.addEventListener("click",() => {
            result.style.display = "block"
        })

        result.addEventListener("mouseover",() => {
            result.style.display = "block"
        })

        result.addEventListener("mouseout",() => {
            result.style.display = "none"
        })
    }

    const [inputValue,setInputValue] = useState("")
    const [debouncedValue] = useDebounce(inputValue,500);

    const handleInputChange = async (e) => {
        const value = e.target.value
        setInputValue(value)
        Payload.searchtext = value
        let response = await axios.get('http://localhost:5000/api/getproduct',{params:Payload})
        setResult(response.data)

        response = await axios.get('http://localhost:5000/api/getctg')
        setCategory(response.data)

        response = await axios.get('http://localhost:5000/api/getbrand')
        setBrand(response.data)
    }

    const handleBrandSelect = async (e,name) => {
        e.preventDefault()
        window.location.href = "/?qbrand=" + name + "&qname=null&qctg=null"
    }

    const handleCtgSelect = async (e,name) => {
        e.preventDefault()
        window.location.href = "/?qctg=" + name + "&qname=null&qbrand=null"
    }

    const handleResultSelect = async (e,name) => {
        e.preventDefault()
        window.location.href = "/?qname=" + name + "&qctg=null&qbrand=null"
    }

    useEffect(() => {
        addevent()
    });

    
    return (
        <>
            <div className="search-div">
                <input
                    type="text"
                    id="searchbar"
                    className="search-input"
                    placeholder="search anything..."
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <div className="result-div" id="result">
                    <h5>Categories</h5>
                    <div className="category-div">
                        {Category.map((item, index) => {
                            return (
                                <div><a className="category-a" onClick={(event) => handleCtgSelect(event,item.CategoryName)}>{item.CategoryName}</a></div>
                            )
                        })}
                    </div>
                    <h5>Brands</h5>
                    <div className="category-div">
                        {Brand.map((item, index) => {
                            return (
                                <div><a className="category-a" onClick={(event) => handleBrandSelect(event,item.Brand)}>{item.Brand}</a></div>
                            )
                        })}
                    </div>
                    <h5>Products</h5>
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
export default Searchbar