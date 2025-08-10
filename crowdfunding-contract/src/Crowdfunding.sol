// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Crowdfunding {
  string public name;
  string public description;
  uint256 public goal;
  uint256 public deadline;
  address public owner;
  bool public paused;

  enum CampaignStatus {
    Active,
    Successful,
    Failed
  }

  CampaignStatus public status;

  error InsufficientFundingAmount(string message);
  error FundingPeriodEnded(string message);
  error OnlyOwnerCanWithdraw(string message);
  error GoalNotMet(string message);
  error TierError(string message);
  error CampaignError(string message);

  struct Tier {
    string name;
    uint256 amount;
    uint256 backers;
  }

  Tier[] public tiers;

  struct Backer {
    uint256 totalContributed;
    mapping(uint256 => bool) tierContributions; // Maps tier index to contribution amount
  }

  mapping(address => Backer) public backers;

  modifier onlyOwner() {
    if (msg.sender != owner) {
      revert OnlyOwnerCanWithdraw("Only the owner can withdraw funds");
    }
    _;
  }

  modifier campaignActive() {
    if (status != CampaignStatus.Active) {
      revert CampaignError("Campaign is not active");
    }
    _;
  }

  modifier notPaused() {
    if (paused) {
      revert CampaignError("Campaign is paused");
    }
    _;
  }

  constructor(address _owner, string memory _name, string memory _description, uint256 _goal, uint256 _duration) {
    name = _name;
    description = _description;
    goal = _goal;
    deadline = block.timestamp + (_duration * 1 days);
    owner = _owner;
    status = CampaignStatus.Active;
  }

  function checkAndUpdateCampaignState() internal {
    if (block.timestamp >= deadline) {
      if (address(this).balance >= goal) {
        status = CampaignStatus.Successful;
      } else {
        status = CampaignStatus.Failed;
      }
    } else {
      if (address(this).balance >= goal) {
        status = CampaignStatus.Successful;
      } else {
        status = CampaignStatus.Active;
      }
    }
  }

  function fund(uint256 _tierIndex) public payable campaignActive notPaused {
    if (msg.value <= 0) {
      revert InsufficientFundingAmount("Funding amount must be greater than zero");
    }
    // next if is already checked in checkAndUpdateCampaignState() internal
    // if (block.timestamp >= deadline) {
    //   revert FundingPeriodEnded("Funding period has ended");
    // }
    if (tiers.length == 0 || _tierIndex >= tiers.length) {
      revert TierError("Invalid tier index");
    }
    if (msg.value != tiers[_tierIndex].amount) {
      revert TierError("Incorrect funding amount for the selected tier");
    }

    tiers[_tierIndex].backers++;
    backers[msg.sender].totalContributed += msg.value;
    backers[msg.sender].tierContributions[_tierIndex] = true;

    checkAndUpdateCampaignState();
  }

  function addTier(string memory _name, uint256 _amount) public onlyOwner {
    if (_amount <= 0) {
      revert TierError("Tier amount must be greater than zero");
    }
    tiers.push(Tier(_name, _amount, 0));
  }

  function removeTier(uint256 index) public onlyOwner {
    if (index >= tiers.length) {
      revert TierError("Invalid tier index");
    }
    tiers[index] = tiers[tiers.length - 1];
    tiers.pop();
  }

  function withdraw() public onlyOwner {
    // next if is already checked in checkAndUpdateCampaignState() internal
    // if (address(this).balance < goal) {
    //   revert GoalNotMet("Goal not met, cannot withdraw funds");
    // }

    checkAndUpdateCampaignState();
    if (status != CampaignStatus.Successful) {
      revert GoalNotMet("Goal not met, cannot withdraw funds");
    }

    uint256 balance = address(this).balance;
    payable(owner).transfer(balance);
  }

  function getContractBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function refund() public {
    checkAndUpdateCampaignState();
    if (status != CampaignStatus.Failed) {
      revert CampaignError("Campaign is not failed, cannot refund");
    }

    Backer storage backer = backers[msg.sender];
    uint256 totalRefund = backer.totalContributed;

    if (totalRefund == 0) {
      revert CampaignError("No contributions to refund");
    }

    backer.totalContributed = 0;
    payable(msg.sender).transfer(totalRefund);
  }

  function hasFundedTier(address _backer, uint256 _tierIndex) public view returns (bool) {
    if (_tierIndex >= tiers.length) {
      revert TierError("Invalid tier index");
    }
    return backers[_backer].tierContributions[_tierIndex];
  }

  function getTiers() public view returns (Tier[] memory) {
    return tiers;
  }

  function togglePause() public onlyOwner {
    paused = !paused;
  }

  function getCampaignStatus() public view returns (CampaignStatus) {
    if (status == CampaignStatus.Active && block.timestamp >= deadline) {
      return address(this).balance >= goal ? CampaignStatus.Successful : CampaignStatus.Failed;
    }
    return status;
  }

  function extendDeadline(uint256 _additionalDays) public onlyOwner campaignActive {
    if (_additionalDays == 0) {
      revert CampaignError("Additional days must be greater than zero");
    }
    deadline += _additionalDays * 1 days;
  }
}
