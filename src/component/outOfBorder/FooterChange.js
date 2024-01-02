import axios from "axios"
import JoditEditor from "jodit-react"
import { useState, Fragment } from "react"
import Swal from "sweetalert2"
import HTMLReactParser from "html-react-parser";

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
            url: "https://eatcom.onrender.com/ChangeWordUp",
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
            url: "https://eatcom.onrender.com/ChangeWordMiddle",
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
            url: "https://eatcom.onrender.com/ChangeWordDown",
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
            url: "https://eatcom.onrender.com/ChangeWordTime",
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
                            <div className="joincoon py-5">
                                <div className="sonOfcoon">
                                    <label className="text-white" htmlFor="blah1">Word 1</label>
                                    {checkword1 ? (
                                        <form className="wordFT" onSubmit={(e) => changeWordUp(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.up}
                                                onChange={(e) => setWordup(e)}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setCheckWord1(false)} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordFT">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah1" defaultValue={HTMLReactParser(`${i.word.up}`)} />
                                            <button onClick={() => setCheckWord1(true)} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
                                        </div>
                                    )}
                                </div>
                                <div className="sonOfcoon">
                                    <label className="text-white" htmlFor="blah2">Word 2</label>
                                    {checkword2 ? (
                                        <form className="wordFT" onSubmit={(e) => changeWordMiddle(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.middle}
                                                onChange={(e) => setWordmiddle(e)}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setCheckWord2(false)} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordFT">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah2" defaultValue={HTMLReactParser(`${i.word.middle}`)} />
                                            <button onClick={() => setCheckWord2(true)} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
                                        </div>
                                    )}
                                </div>
                                <div className="sonOfcoon">
                                    <label className="text-white" htmlFor="blah3">Word 3</label>
                                    {checkword3 ? (
                                        <form className="wordFT" onSubmit={(e) => changeWordDown(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.down}
                                                onChange={(e) => setWorddown(e)}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setCheckWord3(false)} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordFT">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah3" defaultValue={HTMLReactParser(`${i.word.down}`)} />
                                            <button onClick={() => setCheckWord3(true)} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
                                        </div>
                                    )}
                                </div>
                                <div className="sonOfcoon">
                                    <label className="text-white" htmlFor="blah4">Word 4</label>
                                    {checkword4 ? (
                                        <form className="wordFT" onSubmit={(e) => changeWordTime(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.time}
                                                onChange={(e) => setWordtime(e)}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setCheckWord4(false)} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordFT">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah4" defaultValue={HTMLReactParser(`${i.word.time}`)} />
                                            <button onClick={() => setCheckWord4(true)} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
                                        </div>
                                    )}
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