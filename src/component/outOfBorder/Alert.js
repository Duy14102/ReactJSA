function Alert({ type }) {
    return (
        <>
            {type === "Green" ? (
                <div className="d-flex justify-content-end danguru">
                    <div class='alertNow'>
                        <i class="fas fa-check-circle alert__icon"></i>
                        <p class='m-0'>Add to cart success!</p>
                    </div>
                </div>
            ) : type === "Delete" ? (
                <div className="d-flex justify-content-end danguru">
                    <div class='alertDelete'>
                        <i class="fas fa-minus-circle alert__icon"></i>
                        <p class='m-0'>Delete item success!</p>
                    </div>
                </div>
            ) : null}
        </>
    )
}
export default Alert