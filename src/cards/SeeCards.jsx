import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import "react-credit-cards/es/styles-compiled.css";
import Carousel from "./Carousel";

import Card from "react-credit-cards";
export { SeeCards };

function SeeCards() {
    const dispatch = useDispatch();
    const authUser = useSelector(x => x.auth.user);
    const [data, setData] = useState([])
    useEffect(() => {
        const getData = async () => {
            await fetch('https://interview-api.onrender.com/v1/cards?limit=100&page=1', {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authUser.token}`
                }
            }).then((res) => res.json()).then((res) => {
                console.log(res)
                setData(res.results.map((e, i) => {
                    return {
                        key: i, content: (<Card
                            name={e.cardHolder}
                            number={e.cardNumber}
                            expiry={e.cardExpiration}
                            cvc=""
                        />)
                    }
                }))

            }).catch((err) => {
                console.log(err)
            })
        }
        getData()
    }, [])

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            {data.length ? <Carousel
                cards={data}
                height="250px"
                width="30%"
                margin="0 auto"
                offset={2}
                showArrows={false}
            /> : <div>Loading...</div>}

        </div>
    )
}
