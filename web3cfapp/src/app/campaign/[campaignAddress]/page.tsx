"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { toEther } from "thirdweb/utils";
import { client } from "@/app/client";
import CreateTierModal from "@/app/components/CreateTierModal";
import TierCard from "@/app/components/TierCard";

export default function CampaignPage() {
	const account = useActiveAccount();
	const { campaignAddress } = useParams();
	const [isEditing, setIsEditing] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const contract = getContract({
		client: client,
		chain: sepolia,
		address: campaignAddress as string,
	});

	// Name of the campaign
	const { data: name, isLoading: isLoadingName } = useReadContract({
		contract: contract,
		method: "function name() view returns (string)",
		params: [],
	});

	// Description of the campaign
	const { data: description } = useReadContract({
		contract,
		method: "function description() view returns (string)",
		params: [],
	});

	// Campaign deadline
	const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
		contract: contract,
		method: "function deadline() view returns (uint256)",
		params: [],
	});
	// Convert deadline to a date
	const deadlineDate = new Date(
		parseInt(deadline?.toString() as string) * 1000,
	);
	// Check if deadline has passed
	const hasDeadlinePassed = deadlineDate < new Date();

	// Goal amount of the campaign
	const { data: goal, isLoading: isLoadingGoal } = useReadContract({
		contract,
		method: "function goal() view returns (uint256)",
		params: [],
	});

	// Total funded balance of the campaign
	const { data: balance, isLoading: isLoadingBalance } = useReadContract({
		contract: contract,
		method: "function getContractBalance() view returns (uint256)",
		params: [],
	});

	const calculatePercentage = () => {
		if (!balance || !goal || goal === 0n) return 0;

		// Convert BigInt to number for calculation
		const balanceNum = Number(balance);
		const goalNum = Number(goal);

		const percentage = (balanceNum / goalNum) * 100;
		return Math.min(percentage, 100); // Cap at 100%
	};

	const balancePercentage = calculatePercentage();

	// Get tiers for the campaign
	const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
		contract: contract,
		method:
			"function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
		params: [],
	});

	// Get owner of the campaign
	const { data: owner, isLoading: isLoadingOwner } = useReadContract({
		contract: contract,
		method: "function owner() view returns (address)",
		params: [],
	});

	// Get status of the campaign
	const { data: status } = useReadContract({
		contract,
		method: "function getCampaignStatus() view returns (uint8)",
		params: [],
	});

	return (
		<div className="mx-auto max-w-7xl px-2 mt-4 sm:px-6 lg:px-8">
			<div className="flex flex-row justify-between items-center">
				{!isLoadingName && <p className="text-4xl font-semibold">{name}</p>}
				{owner === account?.address && (
					<div className="flex flex-row gap-2">
						{isEditing && (
							<p className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">
								Status:
								{status === 0
									? " Active"
									: status === 1
										? " Successful"
										: status === 2
											? " Failed"
											: " Unknown"}
							</p>
						)}
						<button
							type="button"
							className="px-4 py-2 bg-blue-500 text-white rounded-md"
							onClick={() => setIsEditing(!isEditing)}
						>
							{isEditing ? "Done" : "Edit"}
						</button>
					</div>
				)}
			</div>
			<div className="my-4">
				<p className="text-lg font-semibold">Description:</p>
				<p>{description}</p>
			</div>
			<div className="my-4">
				<p className="text-lg font-semibold">Goal:</p>
				{!isLoadingGoal && goal ? (
					<p>{toEther(goal)} ETH</p>
				) : (
					<p>Loading goal...</p>
				)}
			</div>
			<div className="mb-4">
				<p className="text-lg font-semibold">Deadline:</p>
				{!isLoadingDeadline && deadline ? (
					<div>
						<p>{deadlineDate.toDateString()}</p>
						{hasDeadlinePassed && (
							<p className="text-red-600 font-semibold">Deadline has passed</p>
						)}
					</div>
				) : (
					<p>Loading deadline...</p>
				)}
			</div>
			{!isLoadingBalance && balance !== undefined && goal !== undefined && (
				<div className="mb-4">
					<div className="relative w-2/3 h-6 bg-gray-200 rounded-full dark:bg-gray-700">
						<div
							className="absolute top-0 left-0 h-6 bg-blue-600 rounded-full dark:bg-blue-500"
							style={{ width: `${balancePercentage?.toString()}%` }}
						/>
						<div className="absolute inset-0 flex items-center justify-between px-2">
							<span className="text-white dark:text-white text-xs">
								{toEther(balance || 0n)} ETH
							</span>
							<span className="text-white dark:text-white text-xs">
								{balancePercentage >= 100
									? "Goal Reached!"
									: `${balancePercentage?.toString()}%`}
							</span>
						</div>
					</div>
					<p className="text-sm text-gray-600 mt-1">
						{toEther(balance || 0n)} ETH raised of {toEther(goal || 0n)} ETH
						goal
					</p>
				</div>
			)}
			<div className="mb-4">
				<p className="text-lg font-semibold">Tiers:</p>
				<div className="grid grid-cols-3 gap-4">
					{!isLoadingTiers && tiers && tiers.length > 0
						? tiers.map((tier, index) => (
								<TierCard
									key={tier.name}
									tier={tier}
									index={index}
									contract={contract}
									isEditing={isEditing}
								/>
							))
						: !isEditing && <p>No tiers available for this campaign.</p>}
					{isEditing && (
						// Add a button card with text centered in the middle
						<button
							type="button"
							className="max-w-sm flex flex-col text-center justify-center items-center font-semibold p-6 bg-blue-500 text-white border border-slate-100 rounded-lg shadow"
							onClick={() => setIsModalOpen(true)}
						>
							+ Add Tier
						</button>
					)}
				</div>
			</div>
			{isModalOpen && (
				<CreateTierModal setIsModalOpen={setIsModalOpen} contract={contract} />
			)}
		</div>
	);
}
