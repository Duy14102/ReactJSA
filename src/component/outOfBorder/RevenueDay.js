import $ from 'jquery'
import { useEffect, useState } from 'react'

function RevenueDay() {
    const [CountData, setCountData] = useState()
    useEffect(() => {
        fetch("https://eatcom.onrender.com/GetIncomeDay", {
            method: "get",
        }).then((res) => res.json()).then((data) => {
            setCountData(data.data)
        })
    }, [])

    useEffect(() => {
        var tempData = null
        CountData?.map((i) => {
            tempData = {
                eight: i.percent8,
                nine: i.percent9,
                ten: i.percent10,
                elen: i.percent11,
                twel: i.percent12,
                third: i.percent13,
                fourth: i.percent14,
                fifth: i.percent15,
                sixth: i.percent16,
                seventh: i.percent17,
                eighth: i.percent18,
                nineth: i.percent19,
                tenth: i.percent20,
                elenth: i.percent21,
                twelth: i.percent22
            }
            updateGraph(tempData)
            return null
        })
    }, [CountData])

    function updateGraph(data) {
        $('.graph .bar[data-day]').each(function () {
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
    const datetime = new Date(data).toLocaleDateString()
    return (
        <>
            <h4 className='text-center py-2 text-white'>Today : {datetime}</h4>
            <div className="graph text-center">
                <div>
                    <div className="bar" data-day="eight">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>8</p>
                </div>
                <div>
                    <div className="bar" data-day="nine">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>9</p>
                </div>
                <div>
                    <div className="bar" data-day="ten">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>10</p>
                </div>
                <div>
                    <div className="bar" data-day="elen">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>11</p>
                </div>
                <div>
                    <div className="bar" data-day="twel">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>12</p>
                </div>
                <div>
                    <div className="bar" data-day="third">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>13</p>
                </div>
                <div>
                    <div className="bar" data-day="fourth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>14</p>
                </div>
                <div>
                    <div className="bar" data-day="fifth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>15</p>
                </div>
                <div>
                    <div className="bar" data-day="sixth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>16</p>
                </div>
                <div>
                    <div className="bar" data-day="seventh">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>17</p>
                </div>
                <div>
                    <div className="bar" data-day="eighth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>18</p>
                </div>
                <div>
                    <div className="bar" data-day="nineth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>19</p>
                </div>
                <div>
                    <div className="bar" data-day="tenth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>20</p>
                </div>
                <div>
                    <div className="bar" data-day="elenth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>21</p>
                </div>
                <div>
                    <div className="bar" data-day="twelth">
                        <p className='highIm'></p>
                        <div className="bar-content"></div>
                    </div>
                    <p>22</p>
                </div>
            </div>
            <div className='downGraph' >
                <div className='downHure Hurekaka'>
                    <b>🟩</b> : <p className='m-0 text-muted'>Income %</p>
                </div>
                <div className='downHure'>
                    <b className='text-white'>8</b> : <p className='m-0 text-muted'>Time</p>
                </div>
                <div className='downHure'>
                    <b className='text-white'>Max</b> : <p className='m-0 text-muted'>{VND.format(2000000)}</p>
                </div>
            </div>
        </>
    )
}
export default RevenueDay