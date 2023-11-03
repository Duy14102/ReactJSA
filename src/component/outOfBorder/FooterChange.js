import axios from "axios"
import { useState, Fragment } from "react"
import Swal from "sweetalert2"

function FooterChange({ data }) {
    const [checkword1, setCheckWord1] = useState(false)
    const [checkword2, setCheckWord2] = useState(false)
    const [checkword3, setCheckWord3] = useState(false)
    const [checkword4, setCheckWord4] = useState(false)
    const [wordup, setWordup] = useState()
    const [wordmiddle, setWordmiddle] = useState()
    const [worddown, setWorddown] = useState()
    const [wordtime, setWordtime] = useState()

    const changeWordUp = (e) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/ChangeWordUp",
            data: {
                title: "Footer",
                wordup: wordup
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Change Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Change Fail!',
                    '',
                    'error'
                )
            })
    }

    const changeWordMiddle = (e) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/ChangeWordMiddle",
            data: {
                title: "Footer",
                wordmiddle: wordmiddle
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Change Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Change Fail!',
                    '',
                    'error'
                )
            })
    }

    const changeWordDown = (e) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/ChangeWordDown",
            data: {
                title: "Footer",
                worddown: worddown
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Change Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Change Fail!',
                    '',
                    'error'
                )
            })
    }

    const changeWordTime = (e) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/ChangeWordTime",
            data: {
                title: "Footer",
                wordtime: wordtime
            }
        }
        axios(configuration)
            .then(() => {
                Swal.fire(
                    'Change Successfully!',
                    '',
                    'success'
                ).then(function () {
                    window.location.reload();
                })
            }).catch(() => {
                Swal.fire(
                    'Change Fail!',
                    '',
                    'error'
                )
            })
    }
    return (
        <>
            {Object.values(data).map((i) => {
                if (i.title === "Footer") {
                    return (
                        <Fragment key={i._id}>
                            <div className="d-flex justify-content-center py-5">
                                <div className="joincoon">
                                    <div>
                                        <label className="text-white" htmlFor="word1">Word 1</label>
                                        {checkword1 ? (
                                            <form className="d-flex" style={{ gap: 2 + "%" }} onSubmit={(e) => changeWordUp(e)}>
                                                <input onChange={(e) => setWordup(e.target.value)} className="textDeny" id="word1" defaultValue={i.word.up} required />
                                                <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                    <button type="submit" className="editTableName">✔️</button>
                                                    <button onClick={() => setCheckWord1(false)} type="button" className="editTableName">✖️</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="d-flex" style={{ gap: 2 + "%" }}>
                                                <input style={{ pointerEvents: "none" }} className="textDeny" id="word1" defaultValue={i.word.up} />
                                                <button onClick={() => setCheckWord1(true)} className="editTableName"><i className="fas fa-edit"></i></button>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-white" htmlFor="word2">Word 2</label>
                                        {checkword2 ? (
                                            <form className="d-flex" style={{ gap: 2 + "%" }} onSubmit={(e) => changeWordMiddle(e)}>
                                                <input type="number" onChange={(e) => setWordmiddle(e.target.value)} className="textDeny" id="word2" defaultValue={i.word.middle} required />
                                                <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                    <button type="submit" className="editTableName">✔️</button>
                                                    <button onClick={() => setCheckWord2(false)} type="button" className="editTableName">✖️</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="d-flex" style={{ gap: 2 + "%" }}>
                                                <input style={{ pointerEvents: "none" }} className="textDeny" id="word2" defaultValue={i.word.middle} />
                                                <button onClick={() => setCheckWord2(true)} className="editTableName"><i className="fas fa-edit"></i></button>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-white" htmlFor="word3">Word 3</label>
                                        {checkword3 ? (
                                            <form className="d-flex" style={{ gap: 2 + "%" }} onSubmit={(e) => changeWordDown(e)}>
                                                <input type="email" onChange={(e) => setWorddown(e.target.value)} className="textDeny" id="word3" defaultValue={i.word.down} required />
                                                <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                    <button type="submit" className="editTableName">✔️</button>
                                                    <button onClick={() => setCheckWord3(false)} type="button" className="editTableName">✖️</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="d-flex" style={{ gap: 2 + "%" }}>
                                                <input style={{ pointerEvents: "none" }} className="textDeny" id="word3" defaultValue={i.word.down} />
                                                <button onClick={() => setCheckWord3(true)} className="editTableName"><i className="fas fa-edit"></i></button>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-white" htmlFor="word4">Word 4</label>
                                        {checkword4 ? (
                                            <form className="d-flex" style={{ gap: 2 + "%" }} onSubmit={(e) => changeWordTime(e)}>
                                                <input onChange={(e) => setWordtime(e.target.value)} className="textDeny" id="word4" defaultValue={i.word.time} />
                                                <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                    <button type="submit" className="editTableName">✔️</button>
                                                    <button onClick={() => setCheckWord4(false)} type="button" className="editTableName">✖️</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="d-flex" style={{ gap: 2 + "%" }}>
                                                <input style={{ pointerEvents: "none" }} className="textDeny" id="word4" defaultValue={i.word.time} />
                                                <button onClick={() => setCheckWord4(true)} className="editTableName"><i className="fas fa-edit"></i></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )
                } return null
            })}
        </>
    )
}
export default FooterChange