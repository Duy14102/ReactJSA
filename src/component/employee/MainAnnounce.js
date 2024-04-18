import { useState } from "react"
import AddAnnounce from "./AddAnnounce"
import GetAnnounce from "./GetAnnounce"

function MainAnnounce({ decode }) {
    const [DateInput, setDateInput] = useState()
    return (
        <>
            <div className="addAnn">
                {navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1 ? (
                    <input onInput={(e) => setDateInput(e.target.value)} className="safari2" type='date' placeholder="📅" required />
                ) : (
                    <input style={{ width: 170, height: 40 }} onInput={(e) => setDateInput(e.target.value)} type='date' required />
                )}
                <AddAnnounce />
            </div>
            <GetAnnounce decode={decode} DateInput={DateInput} />
        </>
    )
}
export default MainAnnounce