import axios from "axios";
import { Fragment, useState } from "react"
import Modal from 'react-modal';
import Swal from "sweetalert2";

function MenuChange({ data }) {
    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [checkword1, setCheckWord1] = useState(false)
    const [checkword2, setCheckWord2] = useState(false)
    const [checkword3, setCheckWord3] = useState(false)
    const [wordup, setWordup] = useState()
    const [wordmiddle, setWordmiddle] = useState()
    const [worddown, setWorddown] = useState()
    const [ModalData, setModalData] = useState([])
    const [image, setImage] = useState()

    function convertToBase64(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setImage(reader.result);
            document.getElementById("output15").src = reader.result
        };
        reader.onerror = error => {
            console.log(error);
        }
    }

    const changeImage = (e, name) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/ChangeHeroImage",
            data: {
                title: "Menu",
                name: name,
                image: image
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

    const changeWordUp = (e) => {
        e.preventDefault()
        const configuration = {
            method: "post",
            url: "http://localhost:3000/ChangeWordUp",
            data: {
                title: "Menu",
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
                title: "Menu",
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
                title: "Menu",
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
    return (
        <>
            {Object.values(data).map((i) => {
                if (i.title === "Menu") {
                    return (
                        <Fragment key={i._id}>
                            <div className="Brivo">
                                {i.image?.map((a) => {
                                    return (
                                        a.name === "menucover" ? (
                                            <div key={a.name} className="cacoon">
                                                <h4 className="text-white">Menu Cover</h4>
                                                <img height={200} width={200} alt="" src={a.url} />
                                                <button onClick={() => { setModalOpenDetail(true); setModalData(a) }} className="btn btn-info mt-3">Change</button>
                                            </div>
                                        ) : null
                                    )
                                })}
                                {i.image?.map((a) => {
                                    return (
                                        a.name === "menupage" ? (
                                            <div key={a.name} className="cacoon">
                                                <h4 className="text-white">Menu Page</h4>
                                                <img height={200} width={200} alt="" src={a.url} />
                                                <button onClick={() => { setModalOpenDetail(true); setModalData(a) }} className="btn btn-info mt-3">Change</button>
                                            </div>
                                        ) : null
                                    )
                                })}
                            </div>
                            <div className="d-flex justify-content-center py-5">
                                <div className="joincoon">
                                    <div>
                                        <label className="text-white" htmlFor="word1">Word 1</label>
                                        {checkword1 ? (
                                            <form className="d-flex" style={{ gap: 2 + "%" }} onSubmit={(e) => changeWordUp(e)}>
                                                <textarea onChange={(e) => setWordup(e.target.value)} className="textDeny junlen" id="word1" defaultValue={i.word.up} required />
                                                <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                    <button type="submit" className="editTableName">✔️</button>
                                                    <button onClick={() => setCheckWord1(false)} type="button" className="editTableName">✖️</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="d-flex" style={{ gap: 2 + "%" }}>
                                                <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="word1" defaultValue={i.word.up} />
                                                <button onClick={() => setCheckWord1(true)} className="editTableName"><i className="fas fa-edit"></i></button>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-white" htmlFor="word2">Word 2</label>
                                        {checkword2 ? (
                                            <form className="d-flex" style={{ gap: 2 + "%" }} onSubmit={(e) => changeWordMiddle(e)}>
                                                <textarea onChange={(e) => setWordmiddle(e.target.value)} className="textDeny junlen" id="word2" defaultValue={i.word.middle} required />
                                                <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                    <button type="submit" className="editTableName">✔️</button>
                                                    <button onClick={() => setCheckWord2(false)} type="button" className="editTableName">✖️</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="d-flex" style={{ gap: 2 + "%" }}>
                                                <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="word2" defaultValue={i.word.middle} />
                                                <button onClick={() => setCheckWord2(true)} className="editTableName"><i className="fas fa-edit"></i></button>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-white" htmlFor="word3">Word 3</label>
                                        {checkword3 ? (
                                            <form className="d-flex" style={{ gap: 2 + "%" }} onSubmit={(e) => changeWordDown(e)}>
                                                <textarea onChange={(e) => setWorddown(e.target.value)} className="textDeny junlen" id="word3" defaultValue={i.word.down} />
                                                <div className="d-flex" style={{ gap: 10 + "px" }}>
                                                    <button type="submit" className="editTableName">✔️</button>
                                                    <button onClick={() => setCheckWord3(false)} type="button" className="editTableName">✖️</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="d-flex" style={{ gap: 2 + "%" }}>
                                                <textarea style={{ pointerEvents: "none" }} className="textDeny junlen" id="word3" defaultValue={i.word.down} />
                                                <button onClick={() => setCheckWord3(true)} className="editTableName"><i className="fas fa-edit"></i></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Fragment >
                    )
                }
                return null
            })}
            <Modal isOpen={modalOpenDetail} onRequestClose={() => setModalOpenDetail(false)} ariaHideApp={false}
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
                    <h3 className="text-center">Change {ModalData.name}</h3>
                    <form onSubmit={(e) => changeImage(e, ModalData.name)}>
                        <div className="ImHere4You">
                            <div className="jkarta">
                                <div style={{ width: 100 + "%", height: 65 + "%" }}>
                                    <img width="100%" height="100%" alt="" src={ModalData.url} />
                                </div>
                            </div>
                            <h1 className="thhuhu"><i className="fa-solid fa-arrow-right"></i></h1>
                            <h1 className="image4You"><i className="fa-solid fa-arrow-down"></i></h1>
                            <div className="jkarta">
                                <label className="inputImageDup" htmlFor="inputimage15">
                                    <div className="aboveCameraAppear">
                                        <div className="cameraAppear">
                                            <i className="fa fa-camera fa-2x"></i>
                                        </div>
                                    </div>
                                    <img id="output15" width="100%" height="100%" alt="" src="https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg" />
                                </label>
                                <input id="inputimage15" onChange={convertToBase64} className="fuckThatImage" type="file" style={{ display: "none" }} required />
                            </div>
                        </div>
                        <div className="d-flex justify-content-around">
                            <button onClick={() => setModalOpenDetail(false)} type="button" className="btn btn-secondary">Cancel</button>
                            <button type="submit" className="btn btn-primary">Confirm</button>
                        </div>
                    </form>
                </div>
                <button className='closeModal' onClick={() => setModalOpenDetail(false)}>x</button>
            </Modal>
        </>
    )
}
export default MenuChange