// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Crowdfunding} from "./Crowdfunding.sol";

contract CrowdfundingFactory {
  address public creator;
  bool public paused;

  struct Campaign {
    address campaignAddress;
    address creator;
    string name;
    uint256 creationTime;
  }

  Campaign[] public campaigns;

  mapping(address => Campaign[]) public campaignsCreators;

  // Events for better tracking
  event CampaignCreated(
    address indexed campaignAddress,
    address indexed creator,
    string name,
    uint256 goal,
    uint256 duration
  );

  error OnlyCreatorCanCreate(string message);
  error notPausedError(string message);

  modifier onlyCreator() {
    if (msg.sender != creator) {
      revert OnlyCreatorCanCreate("Only the creator can create campaigns");
    }
    _;
  }

  modifier notPaused() {
    if (paused) {
      revert notPausedError("Factory is paused");
    }
    _;
  }

  constructor() {
    creator = msg.sender;
  }

  function createCampaign(
    string memory _name,
    string memory _description,
    uint256 _goal,
    uint256 _duration
  ) external notPaused returns (address) {
    // Create new campaign contract
    Crowdfunding newCampaign = new Crowdfunding(msg.sender, _name, _description, _goal, _duration);
    address campaignAddress = address(newCampaign);

    // Create campaign struct
    Campaign memory newCampaignStruct = Campaign({
      campaignAddress: campaignAddress,
      creator: msg.sender,
      name: _name,
      creationTime: block.timestamp
    });

    // Add to arrays
    campaigns.push(newCampaignStruct);
    campaignsCreators[msg.sender].push(newCampaignStruct);

    // Emit event
    emit CampaignCreated(campaignAddress, msg.sender, _name, _goal, _duration);

    return campaignAddress;
  }

  function getCampaigns(address _user) external view returns (Campaign[] memory) {
    return campaignsCreators[_user];
  }

  function getAllCampaigns() external view returns (Campaign[] memory) {
    return campaigns;
  }

  function getCampaignsCount() external view returns (uint256) {
    return campaigns.length;
  }

  function togglePause() external onlyCreator {
    paused = !paused;
  }
}
