import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import "react-credit-cards/es/styles-compiled.css";

import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate,

} from "../utils/util";
import Card from "react-credit-cards";


export { Cards };

function Cards() {
    const dispatch = useDispatch();
    const authUser = useSelector(x => x.auth.user);
    const [cardData, setCardData] = useState({
        number: "",
        name: "",
        expiry: "",
        cvc: "",
        issuer: "",
        focused: "",
        formData: null
    })
    const handleCallback = ({ issuer }, isValid) => {
        if (isValid) {
            setCardData({ ...cardData, issuer });
        }
    };

    const handleInputFocus = ({ target }) => {
        setCardData({
            ...cardData,
            focused: target.name
        });
    };

    const handleInputChange = ({ target }) => {
        if (target.name === "number") {
            target.value = formatCreditCardNumber(target.value);
        } else if (target.name === "expiry") {
            target.value = formatExpirationDate(target.value);
        } else if (target.name === "cvc") {
            target.value = formatCVC(target.value);
        }

        setCardData({ ...cardData, [target.name]: target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        const formData = [...e.target.elements]
            .filter(d => d.name)
            .reduce((acc, d) => {
                acc[d.name] = d.value;
                return acc;
            }, {});
        console.log(authUser.token, formData)


        const setData = async () => {
            await fetch('https://interview-api.onrender.com/v1/cards', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authUser.token}`
                },
                body: JSON.stringify({
                    "name": formData.name,
                    "cardExpiration": formData.expiry,
                    "cardHolder": formData.name,
                    "cardNumber": formData.number,
                    "category": "VISA"
                }), // body data type must match "Content-Type" header
            }).then((res) => res.json()).then((res) => {
                console.log(res)

            }).catch((err) => {
                console.log(err)
            })
        }
        setData();
        setCardData({
            number: "",
            name: "",
            expiry: "",
            cvc: "",
            issuer: "",
            focused: "",
            formData: null
        });
    };
    return (
        <div className="col-md-6 offset-md-3 mt-5">

            <Card
                number={cardData.number}
                name={cardData.name}
                expiry={cardData.expiry}
                cvc={cardData.cvc}
                focused={cardData.focused}
                callback={handleCallback}
            />
            <form style={{
                marginTop: "1rem"
            }}
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <input
                        type="tel"
                        name="number"
                        className="form-control"
                        placeholder="Card Number"
                        pattern="[\d| ]{16,22}"
                        required
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        value={cardData.number}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        required
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        value={cardData.name}
                    />
                </div>
                <div className="row">
                    <div className="col-6">
                        <input
                            type="tel"
                            name="expiry"
                            className="form-control"
                            placeholder="Valid Thru"
                            pattern="\d\d/\d\d"
                            required
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            value={cardData.expiry}
                        />
                    </div>
                    <div className="col-6">
                        <input
                            type="tel"
                            name="cvc"
                            className="form-control"
                            placeholder="CVC"
                            pattern="\d{3,4}"
                            required
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            value={cardData.cvc}
                        />
                    </div>
                </div>
                <div className="form-actions">
                    <button className="btn btn-primary btn-block" style={{ marginTop: "1rem" }}>Add</button>
                </div>
            </form>
        </div >
    )
}
