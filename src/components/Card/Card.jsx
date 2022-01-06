import React, { useState, useEffect } from 'react'

const Card = ({ data, token, web3 }) => {

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const getBal = async () => {
            const bal = await token.methods.balanceOf(data).call();
            setBalance(bal)
        }
        getBal();
    }, [])

    return (
        <div className="col-lg-6 my-2">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{data}</h5>
                    <p className="card-text">Balance : {web3.utils.fromWei(balance.toString(), 'ether')}</p>
                </div>
            </div>
        </div>
    )
}

export default Card
