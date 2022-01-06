import React, { useState } from 'react'

const Add = ({vesting, account, setIsAccountSet}) => {

    const [accounts, setAccounts] = useState({
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": "",
        "9": "",
        "10": ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const acc = [
            accounts[1],
            accounts[2],
            accounts[3],
            accounts[4],
            accounts[5],
            accounts[6],
            accounts[7],
            accounts[8],
            accounts[9],
            accounts[10]
        ];

        try{
            await vesting.methods.addAddresses(acc).send({from:account});
            setIsAccountSet(true);
        }catch(error)
        {   
            console.log(error)
            window.alert("Make sure you are the admin and token address is set");
        }
        

    }

    return (
        <div className='mt-3 container'>
            <h2>
                Enter Account Addresses
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="0x6636..."
                        value={accounts[1]} onChange={e => setAccounts({ ...accounts, 1: e.target.value })} required />
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="0x6636..."
                        value={accounts[2]} onChange={e => setAccounts({ ...accounts, 2: e.target.value })} required />
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="0x6636..."
                        value={accounts[3]} onChange={e => setAccounts({ ...accounts, 3: e.target.value })} required />
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="0x6636..."
                        value={accounts[4]} onChange={e => setAccounts({ ...accounts, 4: e.target.value })} required />
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="0x6636..."
                        value={accounts[5]} onChange={e => setAccounts({ ...accounts, 5: e.target.value })} required />
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="0x6636..."
                        value={accounts[6]} onChange={e => setAccounts({ ...accounts, 6: e.target.value })} required />
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="0x6636..."
                        value={accounts[7]} onChange={e => setAccounts({ ...accounts, 7: e.target.value })} required />
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="0x6636..."
                        value={accounts[8]} onChange={e => setAccounts({ ...accounts, 8: e.target.value })} required />
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="0x6636..."
                        value={accounts[9]} onChange={e => setAccounts({ ...accounts, 9: e.target.value })} required />
                </div>
                <div className="form-group my-2">
                    <input type="text" className="form-control" placeholder="0x6636..."
                        value={accounts[10]} onChange={e => setAccounts({ ...accounts, 10: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )

}
export default Add;
