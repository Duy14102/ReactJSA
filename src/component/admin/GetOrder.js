import { useState } from "react";
import { useEffect } from "react";
import OrderAdmin from "../outOfBorder/OrderAdmin";

function GetOrder() {

    const [Order, setOrder] = useState([])
    useEffect(() => {
        fetch("http://localhost:3000/GetAllOrder", {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setOrder(data.data);
        })
    }, [])

    return (
        <>
            <table className='table table-bordered text-center'>
                <thead>
                    <tr>
                        <th>Fullname</th>
                        <th>Phone Number</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <OrderAdmin Data={Order} />
                </tbody>
            </table>
        </>
    )
}
export default GetOrder;