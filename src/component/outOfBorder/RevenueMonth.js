import $ from 'jquery'
import { useEffect, useState } from 'react'

function RevenueMonth() {
    const [CountData, setCountData] = useState()
    useEffect(() => {
        fetch("http://localhost:3000/GetIncomeMonth", {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setCountData(data.data)
        })
    }, [])

    useEffect(() => {
        var tempData = null
        CountData?.map((i) => {
            tempData = {
                eight: i.percent1,
                nine: i.percent2,
                ten: i.percent3,
                elen: i.percent4,
                twel: i.percent5,
                third: i.percent6,
                fourth: i.percent7,
                fifth: i.percent8,
                sixth: i.percent9,
                seventh: i.percent10
            }
            updateGraph(tempData)
            return null
        })
    }, [CountData])

    function updateGraph(data) {
        $('.graph2 .bar[data-day]').each(function () {
            var day = $(this).data('day');
            $(this).find('.bar-content').css('height', data[day] + '%');
            $(this).find('.highIm').append(`${data[day]}%`);
        });
    }

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
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>1-3</p>
                </div>
                <div>
                    <div className="bar" data-day="nine">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>4-6</p>
                </div>
                <div>
                    <div className="bar" data-day="ten">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>7-9</p>
                </div>
                <div>
                    <div className="bar" data-day="elen">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>10-12</p>
                </div>
                <div>
                    <div className="bar" data-day="twel">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>13-15</p>
                </div>
                <div>
                    <div className="bar" data-day="third">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>16-18</p>
                </div>
                <div>
                    <div className="bar" data-day="fourth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>19-21</p>
                </div>
                <div>
                    <div className="bar" data-day="fifth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>22-24</p>
                </div>
                <div>
                    <div className="bar" data-day="sixth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>25-27</p>
                </div>
                <div>
                    <div className="bar" data-day="seventh">
                        <p className='highIm'></p>
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
                    <b className='text-white'>1-3</b> : <p className='m-0 text-muted'>Days</p>
                </div>
                <div className='d-flex text-nowrap' style={{ gap: 5 + "%" }}>
                    <b className='text-white'>Max</b> : <p className='m-0 text-muted'>{VND.format(50000000)}</p>
                </div>
            </div>
        </>
    )
}
export default RevenueMonth