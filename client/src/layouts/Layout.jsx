import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar/Navbar"
import Searchbar from "../components/searchbar/Searchbar"
import './Layout.css'

export default function Layout(){
    return(
        <div>
            <div className="layout-div">
                <div className="navbar-layout-div">
                    <Navbar/>
                    <div className="searchbar-layout-div">
                        <Searchbar/>
                    </div>
                </div>
                <div className="outlet-layout-div">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}