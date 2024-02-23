import axios from "axios"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

function HeroBadge({ word }) {
    const [styleX, setStyleX] = useState()
    useEffect(() => {
        const configuration = {
            method: "get",
            url: "http://localhost:3000/GetHeroUI",
            params: {
                name: "e4onxrx7hmgzmrbel9jk"
            }
        }
        axios(configuration)
            .then((res) => {
                setStyleX({
                    "background": `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${res.data.data})`,
                    "backgroundAttachment": "fixed",
                    "backgroundPosition": "center center",
                    "backgroundRepeat": "no-repeat",
                    "backgroundSize": "cover",
                    "height": "500px"
                })
            }).catch((err) => {
                console.log(err);
            })
    }, [])
    return (
        <div className="py-5 hero-header" style={styleX}>
            <div className="container text-center my-5 pt-5 pb-4">
                <h1 className="display-3 text-white mb-3 animated slideInDown">{word}</h1>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb align-items-center justify-content-center text-uppercase">
                        <li className="breadcrumb-item"><NavLink to="/" className="nav-item nav-link active">Home</NavLink></li>
                        <li className="breadcrumb-item text-white active" aria-current="page">{word}</li>
                    </ol>
                </nav>
            </div>
        </div>
    )
}
export default HeroBadge