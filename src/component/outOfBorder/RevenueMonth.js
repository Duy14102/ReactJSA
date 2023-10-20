import $ from 'jquery'
import { useEffect, useState } from 'react'

function RevenueMonth() {
    const [CountData, setCountData] = useState()
    useEffect(() => {
        fetch("http://localhost:3000/GetIncomeMonth", {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setCountData(data)
        })
    }, [])

    $(function () {
        function updateGraph(data) {
            $('.graph2 .bar[data-day]').each(function () {
                var day = $(this).data('day');
                $(this).find('.bar-content').css('height', data[day] + '%');
            });
        }

        var tempData = {
            eight: CountData?.percent1,
            nine: CountData?.percent2,
            ten: CountData?.percent13,
            elen: CountData?.percent4,
            twel: CountData?.percent5,
            third: CountData?.percent6,
            fourth: CountData?.percent7,
            fifth: CountData?.percent8,
            sixth: CountData?.percent9,
            seventh: CountData?.percent10,
        }

        updateGraph(tempData)
    })

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const data = Date.now()
    const datetime = new Date(data).toLocaleString('en-us', { month: 'long' })
    return (
        <>
            <h4 className='text-center py-2 text-white'>This month : {datetime}</h4>
            <div className="graph2 text-center">
                <div>
                    <div className="bar" data-day="eight">
                        <p>{CountData?.percent1} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>1-3</p>
                </div>
                <div>
                    <div className="bar" data-day="nine">
                        <p>{CountData?.percent2} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>4-6</p>
                </div>
                <div>
                    <div className="bar" data-day="ten">
                        <p>{CountData?.percent3} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>7-9</p>
                </div>
                <div>
                    <div className="bar" data-day="elen">
                        <p>{CountData?.percent4} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>10-12</p>
                </div>
                <div>
                    <div className="bar" data-day="twel">
                        <p>{CountData?.percent5} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>13-15</p>
                </div>
                <div>
                    <div className="bar" data-day="third">
                        <p>{CountData?.percent6} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>16-18</p>
                </div>
                <div>
                    <div className="bar" data-day="fourth">
                        <p>{CountData?.percent7} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>19-21</p>
                </div>
                <div>
                    <div className="bar" data-day="fifth">
                        <p>{CountData?.percent8} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>22-24</p>
                </div>
                <div>
                    <div className="bar" data-day="sixth">
                        <p>{CountData?.percent9} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>25-27</p>
                </div>
                <div>
                    <div className="bar" data-day="seventh">
                        <p>{CountData?.percent10} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>28-30</p>
                </div>
            </div>
            <div className='downGraph' >
                <div className='d-flex text-nowrap' style={{ gap: 5 + "%" }}>
                    <b>🟩</b> : <p className='m-0 text-muted'>Income %</p>
                </div>
                <div className='d-flex text-nowrap' style={{ gap: 5 + "%" }}>
                    <b className='text-white'>1-3</b> : <p className='m-0 text-muted'>Days of month</p>
                </div>
                <div className='d-flex text-nowrap' style={{ gap: 5 + "%" }}>
                    <b className='text-white'>Max</b> : <p className='m-0 text-muted'>{VND.format(1000000)}</p>
                </div>
            </div>
        </>
    )
}
export default RevenueMonth