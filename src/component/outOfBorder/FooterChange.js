import JoditEditor from "jodit-react"
import { useReducer, Fragment, useRef, useEffect } from "react"
import Swal from "sweetalert2"
import socketIOClient from "socket.io-client";
import HTMLReactParser from "html-react-parser";

function FooterChange({ data, decode }) {
    const [menuChangeState, setMenuChangeState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        checkword1: false,
        checkword2: false,
        checkword3: false,
        checkword4: false,
        wordup: null,
        wordmiddle: null,
        worddown: null,
        wordtime: null,
    })
    const socketRef = useRef();

    function Success() {
        Swal.fire(
            'Change Successfully!',
            '',
            'success'
        ).then(function () {
            window.location.reload();
        })
    }

    function Fail() {
        Swal.fire(
            'Change Fail!',
            '',
            'error'
        )
    }

    useEffect(() => {
        socketRef.current = socketIOClient.connect("http://localhost:3000")

        socketRef.current.on('ChangeWordTimeSuccess', dataGot => {
            if (dataGot.title === "Footer" && dataGot.mag === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('ChangeWordTimeFail', dataGot => {
            if (dataGot.title === "Time" && dataGot.mag === decode.userId) {
                Fail()()
            }
        })

        socketRef.current.on('ChangeWordUpSuccess', dataGot => {
            if (dataGot.title === "Time" && dataGot.mag === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('ChangeWordUpFail', dataGot => {
            if (dataGot.title === "Time" && dataGot.mag === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('ChangeWordMiddleSuccess', dataGot => {
            if (dataGot.title === "Time" && dataGot.mag === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('ChangeWordMiddleFail', dataGot => {
            if (dataGot.title === "Time" && dataGot.mag === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('ChangeWordDownSuccess', dataGot => {
            if (dataGot.title === "Time" && dataGot.mag === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('ChangeWordDownFail', dataGot => {
            if (dataGot.title === "Time" && dataGot.mag === decode.userId) {
                Fail()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeWordUp = (e) => {
        e.preventDefault()
        const data = { title: "Footer", wordup: menuChangeState.wordup, mag: decode.userId }
        socketRef.current.emit('ChangeWordUpSocket', data)
    }

    const changeWordMiddle = (e) => {
        e.preventDefault()
        const data = { title: "Footer", wordmiddle: menuChangeState.wordmiddle, mag: decode.userId }
        socketRef.current.emit('ChangeWordMiddleSocket', data)
    }

    const changeWordDown = (e) => {
        e.preventDefault()
        const data = { title: "Footer", worddown: menuChangeState.worddown, mag: decode.userId }
        socketRef.current.emit('ChangeWordDownSocket', data)
    }

    const changeWordTime = (e) => {
        e.preventDefault()
        const data = { title: "Footer", wordtime: menuChangeState.wordtime, mag: decode.userId }
        socketRef.current.emit('ChangeWordTimeSocket', data)
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
                                    {menuChangeState.checkword1 ? (
                                        <form className="wordTomcat" onSubmit={(e) => changeWordUp(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.up}
                                                onChange={(e) => setMenuChangeState({ wordup: e })}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setMenuChangeState({ checkword1: false })} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordTomcat">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah13" defaultValue={HTMLReactParser(i.word.up).props?.children ? HTMLReactParser(i.word.up).props.children : HTMLReactParser(`${i.word.up}`)} />
                                            <button onClick={() => setMenuChangeState({ checkword1: true })} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
                                        </div>
                                    )}
                                </div>
                                <div className="sonOfcoon">
                                    <label className="text-white" htmlFor="blah2">Word 2</label>
                                    {menuChangeState.checkword2 ? (
                                        <form className="wordTomcat" onSubmit={(e) => changeWordMiddle(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.middle}
                                                onChange={(e) => setMenuChangeState({ wordmiddle: e })}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setMenuChangeState({ checkword2: false })} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordTomcat">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah12" defaultValue={HTMLReactParser(i.word.middle).props?.children ? HTMLReactParser(i.word.middle).props.children : HTMLReactParser(`${i.word.middle}`)} />
                                            <button onClick={() => setMenuChangeState({ checkword2: true })} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
                                        </div>
                                    )}
                                </div>
                                <div className="sonOfcoon">
                                    <label className="text-white" htmlFor="blah3">Word 3</label>
                                    {menuChangeState.checkword3 ? (
                                        <form className="wordTomcat" onSubmit={(e) => changeWordDown(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.down}
                                                onChange={(e) => setMenuChangeState({ worddown: e })}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setMenuChangeState({ checkword3: false })} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordTomcat">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah11" defaultValue={HTMLReactParser(i.word.down).props?.children ? HTMLReactParser(i.word.down).props.children : HTMLReactParser(`${i.word.down}`)} />
                                            <button onClick={() => setMenuChangeState({ checkword3: true })} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
                                        </div>
                                    )}
                                </div>
                                <div className="sonOfcoon">
                                    <label className="text-white" htmlFor="blah4">Word 4</label>
                                    {menuChangeState.checkword4 ? (
                                        <form className="wordFT" onSubmit={(e) => changeWordTime(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.time}
                                                onChange={(e) => setMenuChangeState({ wordtime: e })}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setMenuChangeState({ checkword4: false })} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordFT">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah4" defaultValue={HTMLReactParser(i.word.time).props?.children ? HTMLReactParser(i.word.time).props.children : HTMLReactParser(`${i.word.time}`)} />
                                            <button onClick={() => setMenuChangeState({ checkword4: true })} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
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