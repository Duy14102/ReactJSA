import axios from "axios"
import { useState, useEffect, Fragment } from "react"
import HTMLReactParser from 'html-react-parser'

function AnnounceMe() {
    const [news, setNews] = useState([])

    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetNewsActive"
        }
        axios(configuration)
            .then((res) => {
                setNews(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }, [])
    return (
        <>
            <h3 className="text-danger text-center">Announcement</h3>
            {news.length > 0 ? (
                Object.values(news).map((i, index) => {
                    return (
                        <Fragment key={i._id}>
                            <div className="container">
                                <div className="row">
                                    <b>{index}. {i.title}</b>
                                    <div>{HTMLReactParser(i.message)}</div>
                                </div>
                            </div>
                        </Fragment>
                    )
                })
            ) : (
                <p className="text-center text-muted">There's no announcement!</p>
            )}
        </>
    )
}
export default AnnounceMe