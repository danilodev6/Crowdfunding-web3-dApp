import Link from "next/link";
import { getContract, toEther } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { client } from "../client";

type CampaignCardProps = {
  campaignAddress: string;
};

export default function CampaignCard({ campaignAddress }: CampaignCardProps) {
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: campaignAddress,
  });

  const { data: campaignName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: campaignDescription } = useReadContract({
    contract: contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
    contract: contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

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

  return (
    <div className="flex flex-col justify-between max-w-sm p-6 bg-white border border-slate-200 rounded-lg shadow">
      <div>
        {!isLoadingGoal && !isLoadingBalance && (
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
                    ? ""
                    : `${balancePercentage?.toString()}%`}
                </span>
              </div>
            </div>
          </div>
        )}
        <h5 className="mb-2 text-2xl font-bold tracking-tight">
          {campaignName}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {campaignDescription}
        </p>
      </div>
      <Link href={`/campaign/${campaignAddress}`} passHref={true}>
        <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          View Campaign
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </p>
      </Link>
    </div>
  );
}
