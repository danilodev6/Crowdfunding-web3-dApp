"use client";

import { useState } from "react";
import { getContract, prepareContractCall, toWei } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import {
	useActiveAccount,
	useReadContract,
	useSendTransaction,
} from "thirdweb/react";
import { client } from "@/app/client";
import { MyCampaignCard } from "@/app/components/MyCampaignCard";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";

export default function DashboardPage() {
	const account = useActiveAccount();

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const contract = getContract({
		client: client,
		chain: sepolia,
		address: CROWDFUNDING_FACTORY,
	});

	const {
		data: myCampaigns,
		isLoading: isLoadingMyCampaigns,
		refetch,
	} = useReadContract({
		contract: contract,
		method:
			"function getCampaigns(address _user) view returns ((address campaignAddress, address creator, string name, uint256 creationTime)[])",
		params: [account?.address as string],
	});

	return (
		<div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
			<div className="flex flex-row justify-between items-center mb-8">
				<p className="text-4xl font-semibold">Dashboard</p>
				<button
					type="button"
					className="px-4 py-2 bg-blue-500 text-white rounded-md"
					onClick={() => setIsModalOpen(true)}
				>
					Create Campaign
				</button>
			</div>
			<p className="text-2xl font-semibold mb-4">My Campaigns:</p>
			<div className="grid grid-cols-3 gap-4">
				{!isLoadingMyCampaigns &&
					(myCampaigns && myCampaigns.length > 0 ? (
						myCampaigns.map((campaign, index) => (
							<MyCampaignCard
								key={index}
								contractAddress={campaign.campaignAddress}
							/>
						))
					) : (
						<p>No campaigns</p>
					))}
			</div>

			{isModalOpen && (
				<CreateCampaignModal
					setIsModalOpen={setIsModalOpen}
					refetch={refetch}
				/>
			)}
		</div>
	);
}

type CreateCampaignModalProps = {
	setIsModalOpen: (value: boolean) => void;
	refetch: () => void;
};

const CreateCampaignModal = ({
	setIsModalOpen,
	refetch,
}: CreateCampaignModalProps) => {
	const account = useActiveAccount();
	const [campaignName, setCampaignName] = useState<string>("");
	const [campaignDescription, setCampaignDescription] = useState<string>("");
	const [campaignGoal, setCampaignGoal] = useState<number>(1);
	const [campaignDeadline, setCampaignDeadline] = useState<number>(1);

	const contract = getContract({
		client: client,
		chain: sepolia,
		address: CROWDFUNDING_FACTORY,
	});

	const { mutate: sendTransaction, isPending } = useSendTransaction();

	const handleCreateCampaign = async () => {
		if (!account) {
			alert("Please connect your wallet first");
			return;
		}

		if (!campaignName.trim() || !campaignDescription.trim()) {
			alert("Please fill in all fields");
			return;
		}

		try {
			console.log("Creating campaign through factory with params:", {
				name: campaignName,
				description: campaignDescription,
				goal: campaignGoal,
				deadline: campaignDeadline,
			});

			// Convert ETH to Wei for the goal
			const goalInWei = toWei(campaignGoal.toString());

			// Use your factory's createCampaign function
			const transaction = prepareContractCall({
				contract,
				method:
					"function createCampaign(string memory _name, string memory _description, uint256 _goal, uint256 _duration) returns (address)",
				params: [
					campaignName,
					campaignDescription,
					goalInWei, // Now using Wei instead of raw number
					BigInt(campaignDeadline),
				],
			});

			sendTransaction(transaction, {
				onSuccess: (result) => {
					console.log("Campaign created successfully!", result);
					alert("Campaign created successfully!");
					setIsModalOpen(false);
					// Reset form
					setCampaignName("");
					setCampaignDescription("");
					setCampaignGoal(1);
					setCampaignDeadline(1);
					// Wait a bit then refetch
					setTimeout(() => {
						console.log("Refetching campaigns...");
						refetch();
					}, 3000);
				},
				onError: (error) => {
					console.error("Error creating campaign:", error);
					alert("Failed to create campaign. Check console for details.");
				},
			});
		} catch (error) {
			console.error("Error preparing transaction:", error);
			alert("Failed to prepare transaction. Check console for details.");
		}
	};

	const handleCampaignGoal = (value: number) => {
		if (value < 1) {
			setCampaignGoal(1);
		} else {
			setCampaignGoal(value);
		}
	};

	const handleCampaignLengthChange = (value: number) => {
		if (value < 1) {
			setCampaignDeadline(1);
		} else {
			setCampaignDeadline(value);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
			<div className="w-1/2 bg-slate-100 p-6 rounded-md">
				<div className="flex justify-between items-center mb-4">
					<p className="text-lg font-semibold">Create a Campaign</p>
					<button
						type="button"
						className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
						onClick={() => setIsModalOpen(false)}
					>
						Close
					</button>
				</div>
				<div className="flex flex-col">
					<label className="flex flex-col mb-4">
						Campaign Name:
						<input
							type="text"
							value={campaignName}
							onChange={(e) => setCampaignName(e.target.value)}
							placeholder="Campaign Name"
							className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
						/>
					</label>
					<label className="flex flex-col mb-4">
						Campaign Description:
						<textarea
							value={campaignDescription}
							onChange={(e) => setCampaignDescription(e.target.value)}
							placeholder="Campaign Description"
							className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
						></textarea>
					</label>
					<label className="flex flex-col mb-4">
						Campaign Goal (ETH):
						<input
							type="number"
							value={campaignGoal}
							onChange={(e) => handleCampaignGoal(parseFloat(e.target.value))}
							className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
							min="1"
							step="0.01"
						/>
					</label>

					<label className="flex flex-col mb-4">
						Campaign Length (Days):
						<input
							type="number"
							value={campaignDeadline}
							onChange={(e) =>
								handleCampaignLengthChange(parseInt(e.target.value))
							}
							className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
							min="1"
						/>
					</label>

					<button
						type="button"
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
						onClick={handleCreateCampaign}
						disabled={isPending}
					>
						{isPending ? "Creating Campaign..." : "Create Campaign"}
					</button>
				</div>
			</div>
		</div>
	);
};
