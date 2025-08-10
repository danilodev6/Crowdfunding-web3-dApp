import { useState } from "react";
import { prepareContractCall, ThirdwebContract, toWei } from "thirdweb";
import { lightTheme, TransactionButton } from "thirdweb/react";

type CreateTierModalProps = {
  setIsModalOpen: (value: boolean) => void;
  contract: ThirdwebContract;
};

const CreateTierModal = ({
  setIsModalOpen,
  contract,
}: CreateTierModalProps) => {
  const [tierName, setTierName] = useState("");
  const [tierAmountETH, setTierAmountETH] = useState(""); // Store as string for input

  // Convert ETH input to Wei for the contract
  const getTierAmountInWei = (): bigint => {
    if (!tierAmountETH || tierAmountETH === "") return 0n;
    try {
      return toWei(tierAmountETH);
    } catch {
      return 0n;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
      <div className="w-1/2 bg-slate-100 p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Create a Funding Tier</p>
          <button
            type="button"
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <label className="flex flex-col mb-2">
            Tier Name:
            <input
              type="text"
              value={tierName}
              onChange={(e) => setTierName(e.target.value)}
              placeholder="Tier Name"
              className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
            />
          </label>
          <label className="flex flex-col mb-2">
            Tier Cost (in ETH):
            <input
              type="number"
              step="0.01"
              min="0"
              value={tierAmountETH}
              onChange={(e) => setTierAmountETH(e.target.value)}
              placeholder="0.25"
              className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
            />
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Preview: {tierAmountETH || "0"} ETH
          </p>
          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract: contract,
                method: "function addTier(string _name, uint256 _amount)",
                params: [tierName, getTierAmountInWei()],
              })
            }
            onTransactionConfirmed={async () => {
              alert("Tier added successfully!");
              setIsModalOpen(false);
            }}
            onError={(error) => alert(`Error: ${error.message}`)}
            theme={lightTheme()}
          >
            Add Tier
          </TransactionButton>
        </div>
      </div>
    </div>
  );
};

export default CreateTierModal;
