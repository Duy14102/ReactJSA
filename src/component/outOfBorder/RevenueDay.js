import $ from 'jquery'
import { useEffect, useState } from 'react'

function RevenueDay() {
    const [CountData, setCountData] = useState()
    useEffect(() => {
        fetch("http://localhost:3000/GetIncomeDay", {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setCountData(data)
        })
    }, [])

    $(function () {
        function updateGraph(data) {
            $('.graph .bar[data-day]').each(function () {
                var day = $(this).data('day');
                $(this).find('.bar-content').css('height', data[day] + '%');
            });
        }

        var tempData = {
            eight: CountData?.percent8,
            nine: CountData?.percent9,
            ten: CountData?.percent10,
            elen: CountData?.percent11,
            twel: CountData?.percent12,
            third: CountData?.percent13,
            fourth: CountData?.percent14,
            fifth: CountData?.percent15,
            sixth: CountData?.percent16,
            seventh: CountData?.percent17,
            eighth: CountData?.percent18,
            nineth: CountData?.percent19,
            tenth: CountData?.percent20,
            elenth: CountData?.percent21,
            twelth: CountData?.percent22
        }

        updateGraph(tempData)
    })

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const data = Date.now()
    const datetime = new Date(data).toLocaleDateString()
    return (
        <>
            <h4 className='text-center py-2 text-white'>Today : {datetime}</h4>
            <div className="graph text-center">
                <div>
                    <div className="bar" data-day="eight">
                        <p>{CountData?.percent8} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>8</p>
                </div>
                <div>
                    <div className="bar" data-day="nine">
                        <p>{CountData?.percent9} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>9</p>
                </div>
                <div>
                    <div className="bar" data-day="ten">
                        <p>{CountData?.percent10} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>10</p>
                </div>
                <div>
                    <div className="bar" data-day="elen">
                        <p>{CountData?.percent11} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>11</p>
                </div>
                <div>
                    <div className="bar" data-day="twel">
                        <p>{CountData?.percent12} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>12</p>
                </div>
                <div>
                    <div className="bar" data-day="third">
                        <p>{CountData?.percent13} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>13</p>
                </div>
                <div>
                    <div className="bar" data-day="fourth">
                        <p>{CountData?.percent14} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>14</p>
                </div>
                <div>
                    <div className="bar" data-day="fifth">
                        <p>{CountData?.percent15} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>15</p>
                </div>
                <div>
                    <div className="bar" data-day="sixth">
                        <p>{CountData?.percent16} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>16</p>
                </div>
                <div>
                    <div className="bar" data-day="seventh">
                        <p>{CountData?.percent17} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>17</p>
                </div>
                <div>
                    <div className="bar" data-day="eighth">
                        <p>{CountData?.percent18} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>18</p>
                </div>
                <div>
                    <div className="bar" data-day="nineth">
                        <p>{CountData?.percent19} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>19</p>
                </div>
                <div>
                    <div className="bar" data-day="tenth">
                        <p>{CountData?.percent20} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>20</p>
                </div>
                <div>
                    <div className="bar" data-day="elenth">
                        <p>{CountData?.percent21} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>21</p>
                </div>
                <div>
                    <div className="bar" data-day="twelth">
                        <p>{CountData?.percent22} %</p>
                        <div className="bar-content"></div>
                    </div>
                    <p>22</p>
                </div>
            </div>
            <div className='downGraph' >
                <div className='d-flex text-nowrap' style={{ gap: 5 + "%" }}>
                    <b>🟩</b> : <p className='m-0 text-muted'>Income %</p>
                </div>
                <div className='d-flex text-nowrap' style={{ gap: 5 + "%" }}>
                    <b className='text-white'>8</b> : <p className='m-0 text-muted'>Time</p>
                </div>
                <div className='d-flex text-nowrap' style={{ gap: 5 + "%" }}>
                    <b className='text-white'>Max</b> : <p className='m-0 text-muted'>{VND.format(1000000)}</p>
                </div>
            </div>
        </>
    )
}
export default RevenueDay