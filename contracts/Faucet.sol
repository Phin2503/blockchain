// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

contract Faucet {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }

    receive () external payable {}

     function withdraw(uint256 amount) public {
        require(amount <= address(this).balance, "Insufficient balance");
        require(msg.sender == owner, "Only owner can withdraw");
        
        payable(owner).transfer(amount);
    }
}
