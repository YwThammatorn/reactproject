import cart from "../../images/cart.png"
import './Navbar.css'

const Navbar = () => {
    const retstring = window.localStorage.getItem('cartlist')
    const cartlist = JSON.parse(retstring)

    return (
        <>
            <div className="navbar">
                <ul>
                    <li><a>ReactProject</a></li>
                    <li><a href="/">Home</a></li>
                    <li><a href="/order">Order</a></li>
                    <li><a href="/board">Board</a></li>
                    <div className="right-li">
                        <li><a href="/cart">
                        <div className="cart-div">
                            <img src={cart} alt="cart" style={{width:"25px",height:"25px"}}></img>
                            <div className="cart-number">{cartlist.length}</div>
                        </div></a></li>
                    </div>
                </ul>
            </div>
        </>
    )
}
export default Navbar