// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Chicken is ERC20, Ownable {

    mapping(address => uint256) private _stakes;
    mapping(address => uint256) private _lastStakeTimestamp;
    uint256 private _rewardRate = 1;
    uint256 private lockInPeriod = 60; //1 min

    constructor(address initialOwner) 
        ERC20("Chicken", "MANOK") 
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public {
        uint256 adjustedAmount = amount * 1e18;
        _mint(to, adjustedAmount);
    }

    function stake(uint256 amount) public {
        uint256 adjustedAmount = amount * 1e18;

        require(adjustedAmount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= adjustedAmount, "Not Enough Balance!");

        _stakes[msg.sender] += adjustedAmount;
        _lastStakeTimestamp[msg.sender] = block.timestamp;
        _transfer(msg.sender, address(this), adjustedAmount);
  }

    function getStake(address account) public view returns (uint256) {
        uint256 stakedInWei = _stakes[account];
        uint256 stakedInEth = stakedInWei / 1e18;
        return stakedInEth;
  }

    function withdraw() public {
        require(block.timestamp > (_lastStakeTimestamp[msg.sender] + lockInPeriod), "Locked tokens ongoing, It is not possible to withdraw your funds");
        require(_stakes[msg.sender] > 0, "No Balance");

        uint256 stakedAmount = _stakes[msg.sender];
        uint256 reward = ((block.timestamp - _lastStakeTimestamp[msg.sender]) * _rewardRate) * 1e18;

        _stakes[msg.sender] = 0;
        _transfer(address(this), msg.sender, stakedAmount);
        _mint(msg.sender, reward);
  }

    function getWithdraw(address account) public view returns (uint256) {
        uint256 stakedAmount = _stakes[msg.sender] / 1e18;
        uint256 reward = ((block.timestamp - _lastStakeTimestamp[account]) * _rewardRate);

        uint256 total = reward + stakedAmount; 
        return total;
  }

     function getElapsedStakeTime(address account) public view returns (uint256) {
        uint256 time = (block.timestamp - _lastStakeTimestamp[account]);
        return time;
  } 

    function getLastStakeTimestamp(address account) public view returns (uint256) {
        return _lastStakeTimestamp[account];
  }


    
}