import axios from "axios"
import { useState, useEffect, Fragment, useRef } from "react"
import HTMLReactParser from 'html-react-parser'
import socketIOClient from "socket.io-client";

function AnnounceMe() {
    const [news, setNews] = useState([])
    const socketRef = useRef();

    const called = () => {
        const configuration = {
            method: "get",
            url: "https://eatcom.onrender.com/GetNewsActive"
        }
        axios(configuration)
            .then((res) => {
                setNews(res.data.data)
            }).catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        called()

        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('UpdateNewsSuccess', dataGot => {
            if (dataGot?.data) {
                called()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
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