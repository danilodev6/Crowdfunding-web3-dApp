// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {CrowdfundingFactory} from "../src/CrowdfundingFactory.sol";
import {Crowdfunding} from "../src/Crowdfunding.sol";

contract DeployScript is Script {
  function setUp() public {}

  function run() public {
    // Start broadcasting transactions - this will use the private key from your environment
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address deployer = vm.addr(deployerPrivateKey);

    console.log("Deploying with address:", deployer);
    console.log("Deployer balance:", deployer.balance);

    vm.startBroadcast(deployerPrivateKey);

    // Deploy the CrowdfundingFactory contract
    console.log("Deploying CrowdfundingFactory...");
    CrowdfundingFactory factory = new CrowdfundingFactory();
    console.log("CrowdfundingFactory deployed at:", address(factory));
    console.log("Factory creator:", factory.creator());

    // Wait a moment and check initial state
    console.log("Initial campaigns count:", factory.getCampaignsCount());

    // Create a sample campaign through the factory
    console.log("Creating a sample campaign...");
    address campaignAddress = factory.createCampaign(
      "My First Campaign", // Campaign name
      "A test campaign for learning", // Description
      1 ether, // Goal: 1 ETH
      30 // Duration: 30 days
    );

    console.log("Sample campaign created at:", campaignAddress);

    // Verify the campaign was added
    console.log("Campaigns count after creation:", factory.getCampaignsCount());

    // Get all campaigns to verify
    CrowdfundingFactory.Campaign[] memory allCampaigns = factory.getAllCampaigns();
    console.log("Total campaigns found:", allCampaigns.length);

    if (allCampaigns.length > 0) {
      console.log("First campaign address:", allCampaigns[0].campaignAddress);
      console.log("First campaign creator:", allCampaigns[0].creator);
      console.log("First campaign name:", allCampaigns[0].name);

      // Get reference to the created campaign contract
      Crowdfunding campaign = Crowdfunding(allCampaigns[0].campaignAddress);

      // Add some funding tiers to make the campaign more interesting
      console.log("Adding funding tiers...");
      campaign.addTier("Bronze Supporter", 0.1 ether); // 0.1 ETH tier
      campaign.addTier("Silver Supporter", 0.5 ether); // 0.5 ETH tier
      campaign.addTier("Gold Supporter", 1.0 ether); // 1.0 ETH tier

      // Verify the campaign details
      console.log("Campaign name:", campaign.name());
      console.log("Campaign goal:", campaign.goal());
      console.log("Campaign deadline:", campaign.deadline());
      console.log("Campaign owner:", campaign.owner());

      // Get tiers
      Crowdfunding.Tier[] memory tiers = campaign.getTiers();
      console.log("Number of tiers added:", tiers.length);
    } else {
      console.log("ERROR: No campaigns were created!");
    }

    console.log("Deployment completed!");
    console.log("Factory Address:", address(factory));
    if (allCampaigns.length > 0) {
      console.log("Sample Campaign Address:", allCampaigns[0].campaignAddress);
    }

    // Stop broadcasting transactions
    vm.stopBroadcast();
  }
}
