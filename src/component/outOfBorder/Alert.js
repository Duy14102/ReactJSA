import { useEffect } from "react"

function Alert({ type, call, setCall }) {
    useEffect(() => {
        if (call) {
            setTimeout(() => {
                setCall(false)
            }, 3000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setCall])
    return (
        <>
            {type === "Green" ? (
                <div className="d-flex justify-content-end danguru">
                    <div class='alertNow'>
                        <i className="fas fa-check-circle alert__icon"></i>
                        <p class='m-0'>Add to cart success!</p>
                    </div>
                </div>
            ) : type === "Delete" ? (
                <div className="d-flex justify-content-end danguru">
                    <div class='alertDelete'>
                        <i className="fas fa-minus-circle alert__icon"></i>
                        <p class='m-0'>Delete item success!</p>
                    </div>
                </div>
            ) : null}
        </>
    )
}
export default Alert