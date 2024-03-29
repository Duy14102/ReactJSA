import JoditEditor from "jodit-react";
import { Fragment, useReducer, useRef, useEffect } from "react"
import Modal from 'react-modal';
import Swal from "sweetalert2";
import HTMLReactParser from "html-react-parser";
import socketIOClient from "socket.io-client";

function AboutChange({ data, decode }) {
    const [heroChangeState, setHeroChangeState] = useReducer((prev, next) => ({
        ...prev, ...next
    }), {
        modalOpenDetail: false,
        checkword1: false,
        checkword2: false,
        checkword3: false,
        modalName: null,
        wordup: null,
        wordmiddle: null,
        worddown: null,
        ModalData: [],
        image: null
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
        socketRef.current = socketIOClient.connect("https://eatcom.onrender.com")

        socketRef.current.on('ChangeHeroImageSuccess', dataGot => {
            if (dataGot.title === "About" && dataGot.mag === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('ChangeHeroImageFail', dataGot => {
            if (dataGot.title === "About" && dataGot.mag === decode.userId) {
                Fail()()
            }
        })

        socketRef.current.on('ChangeWordUpSuccess', dataGot => {
            if (dataGot.title === "About" && dataGot.mag === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('ChangeWordUpFail', dataGot => {
            if (dataGot.title === "About" && dataGot.mag === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('ChangeWordMiddleSuccess', dataGot => {
            if (dataGot.title === "About" && dataGot.mag === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('ChangeWordMiddleFail', dataGot => {
            if (dataGot.title === "About" && dataGot.mag === decode.userId) {
                Fail()
            }
        })

        socketRef.current.on('ChangeWordDownSuccess', dataGot => {
            if (dataGot.title === "About" && dataGot.mag === decode.userId) {
                Success()
            }
        })

        socketRef.current.on('ChangeWordDownFail', dataGot => {
            if (dataGot.title === "About" && dataGot.mag === decode.userId) {
                Fail()
            }
        })

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function convertToBase64(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setHeroChangeState({ image: reader.result })
            document.getElementById("output11").src = reader.result
        };
        reader.onerror = error => {
            console.log(error);
        }
    }

    const changeImage = (e, name) => {
        e.preventDefault()
        const data = { title: "About", name: name, image: heroChangeState.image, mag: decode.userId }
        socketRef.current.emit('ChangeHeroImageSocket', data)
    }

    const changeWordUp = (e) => {
        e.preventDefault()
        const data = { title: "About", wordup: heroChangeState.wordup, mag: decode.userId }
        socketRef.current.emit('ChangeWordUpSocket', data)
    }

    const changeWordMiddle = (e) => {
        e.preventDefault()
        const data = { title: "About", wordmiddle: heroChangeState.wordmiddle, mag: decode.userId }
        socketRef.current.emit('ChangeWordMiddleSocket', data)
    }

    const changeWordDown = (e) => {
        e.preventDefault()
        const data = { title: "About", worddown: heroChangeState.worddown, mag: decode.userId }
        socketRef.current.emit('ChangeWordDownSocket', data)
    }

    return (
        <>
            {Object.values(data).map((i) => {
                if (i.title === "About") {
                    return (
                        <Fragment key={i._id}>
                            <div className="AnotherBrivo">
                                {i.image?.map((a) => {
                                    return (
                                        a.name === "k9axej6qza2mzsp8lwvj" ? (
                                            <div key={a.name} className="cacoon">

                                                <img height={250} width={250} alt="" src={a.url} />
                                                <h5 className="text-white titleIMG">Image 1</h5>
                                                <button className="gear" onClick={() => setHeroChangeState({ modalOpenDetail: true, ModalData: a, modalName: "Image 1" })}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg></button>
                                            </div>
                                        ) : null
                                    )
                                })}
                                {i.image?.map((a) => {
                                    return (
                                        a.name === "ixdn78iskyewdqszx4rf" ? (
                                            <div key={a.name} className="cacoon">
                                                <img height={250} width={250} alt="" src={a.url} />
                                                <h5 className="text-white titleIMG">Image 2</h5>
                                                <button className="gear" onClick={() => setHeroChangeState({ modalOpenDetail: true, ModalData: a, modalName: "Image 2" })}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg></button>
                                            </div>
                                        ) : null
                                    )
                                })}
                            </div>
                            <div className="AnotherBrivo" style={{ paddingTop: 5 + "%" }}>
                                {i.image?.map((a) => {
                                    return (
                                        a.name === "ucvurntwkq3pgbvq8scl" ? (
                                            <div key={a.name} className="cacoon">
                                                <img height={250} width={250} alt="" src={a.url} />
                                                <h5 className="text-white titleIMG">Image 3</h5>
                                                <button className="gear" onClick={() => setHeroChangeState({ modalOpenDetail: true, ModalData: a, modalName: "Image 3" })}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg></button>
                                            </div>
                                        ) : null
                                    )
                                })}
                                {i.image?.map((a) => {
                                    return (
                                        a.name === "irnkhvizbt88rhedgys2" ? (
                                            <div key={a.name} className="cacoon">
                                                <img height={250} width={250} alt="" src={a.url} />
                                                <h5 className="text-white titleIMG">Image 4</h5>
                                                <button className="gear" onClick={() => setHeroChangeState({ modalOpenDetail: true, ModalData: a, modalName: "Image 4" })}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg></button>
                                            </div>
                                        ) : null
                                    )
                                })}
                            </div>

                            <div className="joincoon py-5">
                                <div className="sonOfcoon">
                                    <label className="text-white" htmlFor="blah7">Word 1</label>
                                    {heroChangeState.checkword1 ? (
                                        <form className="wordTomcat" onSubmit={(e) => changeWordUp(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.up}
                                                onChange={(e) => setHeroChangeState({ wordup: e })}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setHeroChangeState({ checkword1: false })} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordTomcat">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah13" defaultValue={HTMLReactParser(i.word.up).props?.children ? HTMLReactParser(i.word.up).props.children : HTMLReactParser(`${i.word.up}`)} />
                                            <button onClick={() => setHeroChangeState({ checkword1: true })} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
                                        </div>
                                    )}
                                </div>
                                <div className="sonOfcoon">
                                    <label className="text-white" htmlFor="blah6">Word 2</label>
                                    {heroChangeState.checkword2 ? (
                                        <form className="wordTomcat" onSubmit={(e) => changeWordMiddle(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.middle}
                                                onChange={(e) => setHeroChangeState({ wordmiddle: e })}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setHeroChangeState({ checkword2: false })} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordTomcat">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah12" defaultValue={HTMLReactParser(i.word.middle).props?.children ? HTMLReactParser(i.word.middle).props.children : HTMLReactParser(`${i.word.middle}`)} />
                                            <button onClick={() => setHeroChangeState({ checkword2: true })} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
                                        </div>
                                    )}
                                </div>
                                <div className="sonOfcoon">
                                    <label className="text-white" htmlFor="blah5">Word 3</label>
                                    {heroChangeState.checkword3 ? (
                                        <form className="wordTomcat" onSubmit={(e) => changeWordDown(e)}>
                                            <JoditEditor
                                                className="textDeny junlen"
                                                required
                                                value={i.word.down}
                                                onChange={(e) => setHeroChangeState({ worddown: e })}
                                            />
                                            <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                <button type="submit" className="editTableName">✔️</button>
                                                <button onClick={() => setHeroChangeState({ checkword3: false })} type="button" className="editTableName">✖️</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="wordTomcat">
                                            <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="blah11" defaultValue={HTMLReactParser(i.word.down).props?.children ? HTMLReactParser(i.word.down).props.children : HTMLReactParser(`${i.word.down}`)} />
                                            <button onClick={() => setHeroChangeState({ checkword3: true })} className="editTableName2"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg></button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </Fragment>
                    )
                }
                return null
            })}
            <Modal isOpen={heroChangeState.modalOpenDetail} onRequestClose={() => setHeroChangeState({ modalOpenDetail: false })} ariaHideApp={false}
                style={{
                    overlay: {
                        position: 'fixed',
                        zIndex: 998,
                        backgroundColor: 'rgb(33 33 33 / 75%)'
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        width: "70vw",
                        height: "50vh",
                        zIndex: 999
                    },
                }}>
                <div className="p-3">
                    <h3 className="text-center">Change {heroChangeState.modalName}</h3>
                    <form onSubmit={(e) => changeImage(e, heroChangeState.ModalData.name)}>
                        <div className="ImHere4You">
                            <div className="jkarta2 my-4">
                                <img width="100%" height="100%" alt="" src={heroChangeState.ModalData.url} />
                            </div>
                            <h1 className="thhuhu"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" /></svg></h1>
                            <h1 className="image4You"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" /></svg></h1>
                            <div className="jkarta2">
                                <label className="inputImageDup" htmlFor="inputimage15">
                                    <div className="aboveCameraAppear">
                                        <div className="cameraAppear">
                                            <svg style={{ fontSize: "xx-large", fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" /></svg>
                                        </div>
                                    </div>
                                    <img id="output15" width="100%" height="100%" alt="" src="https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg" />
                                </label>
                                <input id="inputimage15" onChange={convertToBase64} className="fuckThatImage" type="file" style={{ display: "none" }} required />
                            </div>
                        </div>
                        <div className="d-flex justify-content-around">
                            <button onClick={() => setHeroChangeState({ modalOpenDetail: false })} type="button" className="btn btn-secondary">Cancel</button>
                            <button type="submit" className="btn btn-primary">Confirm</button>
                        </div>
                    </form>
                </div>
                <button className='closeModal' onClick={() => setHeroChangeState({ modalOpenDetail: false })}>x</button>
            </Modal>
        </>
    )
}
export default AboutChange