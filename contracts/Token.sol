// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{
  constructor(address _contractAddress) ERC20("XYZ Token", "XYZ") {
    _mint(_contractAddress, 1000000000 * (10**18));
  }
}
