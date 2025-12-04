let cartlist = []
let orderlist = [null,null,null,null,null]

let string = JSON.stringify(cartlist)
let string2 = JSON.stringify(orderlist)
localStorage.setItem("cartlist", string)
localStorage.setItem("orderlist",string2)
