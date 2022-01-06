const Vesting = artifacts.require("Vesting");
const Token = artifacts.require("Token");
const { expectRevert,time } = require('@openzeppelin/test-helpers');

contract("Vesting", function ( accounts ) {
  
  let vesting
  let token
  beforeEach(async () => {
    vesting = await Vesting.new();
    token = await Token.new(vesting.address)
  })

  it("should not add accounts if not called by admin", async () => {
    await expectRevert(
      vesting.addAddresses(accounts,{from:accounts[2]})
      , "Only admin is allowed"
    )
  });

  it("should not add accounts if exactly 10 accounts not provided", async () => {
    await expectRevert(
      vesting.addAddresses([accounts[0],accounts[1],accounts[2]],{from:accounts[0]})
      , "Exactly 10 accounts are allowed"
    )
  })

  it("should add accounts", async() => {
    await vesting.setTokenAddress(token.address,{from:accounts[0]});
    await vesting.addAddresses(accounts,{from:accounts[0]})
    const data = await vesting.getAccounts();
    for(let i=0;i<10;i++)
      assert(data[i] == accounts[i])
  });

  it("should not withdraw if accounts have not been set",async () => {
    await expectRevert(
      vesting.withdraw({from:accounts[0]})
      ,"Accounts have not been set"
    )
  });

  it("should not withdraw if enough time has not passed", async () => {
    await vesting.setTokenAddress(token.address,{from:accounts[0]});
    await vesting.addAddresses(accounts,{from:accounts[0]});
    await expectRevert(
      vesting.withdraw({from:accounts[0]})
      , "Not enough time has passed"
    );
  });

  // it("should not withdraw if token address not given", async() => {
  //   await vesting.addAddresses(accounts,{from:accounts[0]});
  //   await time.increase(65);

  //   await expectRevert(
  //     vesting.withdraw({from:accounts[0]})
  //     , "No token address specified"
  //   )
  // })

  it("should withdraw",async () => {
    await vesting.setTokenAddress(token.address,{from:accounts[0]});
    await vesting.addAddresses(accounts,{from:accounts[0]});
    
    const previousBal1 = await token.balanceOf(accounts[1]);
    const previousBal2 = await token.balanceOf(accounts[2]);
    await time.increase(65);

    await vesting.withdraw({from:accounts[0]});

    const currBal1 = await token.balanceOf(accounts[1]);
    const currBal2 = await token.balanceOf(accounts[2]);

    assert((currBal1.sub(previousBal1)).toString() === "190258751902587519025");
    assert((currBal2.sub(previousBal2)).toString() === "190258751902587519025");
  });

  it("should withdraw muliple times", async () => {
    await vesting.setTokenAddress(token.address,{from:accounts[0]});
    await vesting.addAddresses(accounts,{from:accounts[0]});
    
    const previousBal1 = await token.balanceOf(accounts[1]);
    const previousBal2 = await token.balanceOf(accounts[2]);
    await time.increase(65);

    await vesting.withdraw({from:accounts[0]});

    const currBal1 = await token.balanceOf(accounts[1]);
    const currBal2 = await token.balanceOf(accounts[2]);

    assert((currBal1.sub(previousBal1)).toString() === "190258751902587519025");
    assert((currBal2.sub(previousBal2)).toString() === "190258751902587519025");
  
    await time.increase(65);

    await vesting.withdraw({from:accounts[0]});
    const futureBal1 = await token.balanceOf(accounts[1]);
    const futureBal2 = await token.balanceOf(accounts[2]);

    assert((futureBal1.sub(currBal1)).toString() === "190258751902587519025");
    assert((futureBal2.sub(currBal2)).toString() === "190258751902587519025");
  

  })
});
