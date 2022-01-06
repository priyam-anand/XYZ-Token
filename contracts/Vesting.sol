// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vesting {
    
    address[] private accounts;
    uint256 private startTime;
    uint256 private lastPayout;
    address private admin;
    uint256 private payoutAmount;
    address private tokenAddress;
    uint private payout;

    constructor() {
        startTime = block.timestamp;
        lastPayout = startTime;
        admin = msg.sender;
    }

    // test helper functions
    function getPayout() public view returns (uint256) {
        return payout;
    }
    function getAccounts() public view returns (address[] memory) {
        return accounts;
    }
    function getLastPayout() public view returns (uint256) {
        return lastPayout;
    }
    function getAddresses() public view returns (address[] memory){
        return accounts;
    }


    function isAccountsSet() public view returns(bool){
        return accounts.length == 10;
    }

    function setTokenAddress(address _tokenAddress) public onlyAdmin{
        require(_tokenAddress != address(0),"token address cannot be 0");
        require(tokenAddress == address(0),"token address is already set");
        tokenAddress = _tokenAddress;
        payout = ERC20(_tokenAddress).totalSupply() / 525600;
    }

    function addAddresses(address[] memory _accounts) public onlyAdmin {
        require(_accounts.length == 10, "Exactly 10 accounts are allowed");
        require(accounts.length == 0,"Accounts already set");
        require(tokenAddress != address(0), "Token Address is not set");
        for (uint256 i = 0; i < _accounts.length; i++) {
            accounts.push(_accounts[i]);
        }
    }

    function withdraw() public onlyAdmin {
        require(accounts.length == 10, "Accounts have not been set");
        uint256 time = block.timestamp - lastPayout;
        require(time >= 60, "Not enough time has passed");

        require(tokenAddress != address(0),"No token address specified");

        ERC20 token = ERC20(tokenAddress);

        require(token.balanceOf(address(this)) > 0, "All payouts have been done");
        // calculate the number of payouts and amount
        uint256 timeSlots = time / 60;
        uint256 amount = timeSlots * payout;
        if (amount > token.balanceOf(address(this))) {
            amount = token.balanceOf(address(this));
        }

        // transfer amount/10 to every account
        for (uint256 i = 0; i < accounts.length; i++) {
            token.transfer(accounts[i], amount / 10);
        }

        // update the time of last payout
        lastPayout = lastPayout + time * 60;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin is allowed");
        _;
    }
}
