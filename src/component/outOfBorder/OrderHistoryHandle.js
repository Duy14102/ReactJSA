function OrderHistoryHandle({ i, datetime, seeMore, setSeeMore, index, toppingArray, setModalOpenDetail, setModalData, checkBack, totalMainArray }) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    var inTotal = 0, countTotal2 = 0
    return (
        <div style={{ opacity: checkBack ? 0.5 : 1, pointerEvents: checkBack ? "none" : null, width: window.innerWidth > 991 ? "47%" : "100%", position: "relative", marginTop: window.innerWidth > 991 && index > 1 ? 30 : window.innerWidth <= 991 && index >= 1 ? 30 : null }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#374148", color: "#fff", padding: "15px 15px 0 15px" }}>
                <p className="m-0">Id : {i._id}</p>
                <p className="m-0">Date : {datetime}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#374148", color: "#fff", padding: 15 }}>
                <p className="m-0">Status : {i.status === 3 ? "🔴( denied )" : i.status === 5 ? "🟡( completed )" : i.status === 6 ? "🟠( canceled )" : null}</p>
                {i.employee?.length > 0 ? (
                    i.employee?.map((z) => {
                        return (
                            <p className="m-0" key={z}>Employee : {z.email}</p>
                        )
                    })
                ) : null}
            </div>
            <table className="table solotable m-0 border-none">
                <thead>
                    <tr style={{ color: "#0F172B", backgroundColor: "#4285f4" }}>
                        <th style={{ textAlign: "center", color: "#fff" }}>{window.innerWidth > 575 ? "No" : "Quantity"}</th>
                        <th colSpan={window.innerWidth > 575 ? null : 2} style={{ color: "#fff" }}>Items</th>
                        {window.innerWidth > 575 ? (
                            <>
                                <th style={{ textAlign: "center", color: "#fff" }}>Quantity</th>
                                <th style={{ textAlign: "center", color: "#fff" }}>Price</th>
                            </>
                        ) : null}
                    </tr>
                </thead>
                <tbody>
                    {seeMore ? (
                        i.orderitems?.map((a, indexK) => {
                            inTotal = a.topping?.reduce((acc, o) => acc + parseInt(o.foodprice), 0)
                            if (inTotal) {
                                countTotal2 = (inTotal + a.data.foodprice) * a.quantity
                            } else {
                                countTotal2 = a.data.foodprice * a.quantity
                            }
                            return (
                                <tr key={indexK} style={{ verticalAlign: "middle", background: "#2C343A", color: "lightgray" }}>
                                    <td className='text-center'>{window.innerWidth > 575 ? indexK + 1 : a.quantity}</td>
                                    <td colSpan={window.innerWidth > 575 ? null : 2}>
                                        <div>
                                            <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                                <img alt="" src={a.data.foodimage} width={70} height={60} />
                                                <div>
                                                    <p className="m-0" style={{ fontSize: 17 }}>{a.data.foodname}</p>
                                                    <p className="m-0 text-start" style={{ fontSize: 15, color: "#FEA116" }}><b>{VND.format(a.data.foodprice)}</b></p>
                                                </div>
                                            </div>
                                            {a.topping ? (
                                                a.topping.map((p) => {
                                                    return (
                                                        <div key={p._id} className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                                            <img alt="" src={p.foodimage} width={45} height={40} />
                                                            <div>
                                                                <p className="m-0" style={{ fontSize: 15 }}>{p.foodname}</p>
                                                                <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 13 }}><b>{VND.format(p.foodprice)}</b></p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            ) : null}
                                        </div>
                                        {i.orderitems.lastIndexOf(i.orderitems.slice(-1)[0]) === indexK ? (
                                            <p onClick={() => setSeeMore(false)} className="seeMoreInOrder">See less</p>
                                        ) : null}
                                    </td>
                                    {window.innerWidth > 575 ? (
                                        <>
                                            <td className='text-center'>{a.quantity}</td>
                                            <td className='text-center'>{VND.format(countTotal2)}</td>
                                        </>
                                    ) : null}
                                </tr>

                            )
                        })
                    ) : (
                        <tr style={{ verticalAlign: "middle", background: "#2C343A", color: "lightgray" }}>
                            <td className='text-center'>1</td>
                            <td colSpan={window.innerWidth > 575 ? null : 2}>
                                <div>
                                    <p className="m-0" style={{ fontSize: 17 }}>{i.orderitems[0]?.data.foodname}</p>
                                    <p className="m-0 text-start" style={{ fontSize: 15, color: "#FEA116" }}><b>{VND.format(i.orderitems[0]?.data.foodprice)}</b></p>
                                </div>
                            </div>
                            {i?.orderitems[0]?.topping[0] ? (
                                <div className="d-flex align-items-center" style={{ gap: 10, marginLeft: 25, marginTop: 10 }}>
                                    <img alt="" src={i?.orderitems[0]?.topping[0]?.foodimage} width={45} height={40} />
                                    <div>
                                        <p className="m-0" style={{ fontSize: 15 }}>{i.orderitems[0]?.topping[0]?.foodname}</p>
                                        <p className="m-0 text-start" style={{ color: "#FEA116", fontSize: 13 }}><b>{VND.format(i.orderitems[0]?.topping[0]?.foodprice)}</b></p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                    {i.orderitems?.length > 1 && seeMore !== index ? (
                        <p onClick={() => setSeeMore(index)} className="seeMoreInOrder">See more</p>
                    ) : i.orderitems?.length === 1 && toppingArray.length > 1 && seeMore !== index ? (
                        <p onClick={() => setSeeMore(index)} className="seeMoreInOrder">See more</p>
                    ) : null}
                    {seeMore === index ? (
                        <p onClick={() => setSeeMore(null)} className="seeMoreInOrder">See less</p>
                    ) : null}
                </div>
                <div>
                    <p>Status : {i.status === 3 ? "🔴( denied )" : i.status === 5 ? "🟡( completed )" : i.status === 6 ? "🟠( canceled )" : null}</p>
                    <p>Payment : {i.paymentmethod.method === 1 ? "e-wallet" : i.paymentmethod.method === 2 ? "COD" : null}</p>
                    {i.employee?.length > 0 ? (
                        i.employee?.map((z) => {
                            return (
                                <p key={z}>Employee : {z.email}</p>
                            )
                        })
                    ) : null}
                    <button onClick={() => { setModalOpenDetail(true); setModalData(i) }} className="btn btn-warning inforItKK"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></button>
                </div>
            </div>
        </div>
    )
}
export default OrderHistoryHandle