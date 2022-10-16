// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UNIQ is ERC20 {mapping(address => bool) public isPresent;
    address public owner;
    constructor() ERC20("UNIQ", "UNIQ") {owner = address(this);
        _mint(owner, 10000000000000000000000000000);}

    function airdrop(address receiver) public {_transfer(owner, receiver, 1000000000000000000000);}

}