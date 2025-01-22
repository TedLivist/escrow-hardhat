import { ethers } from 'ethers';
// import Escrow from './Escrow';
import EscrowJson from './artifacts/contracts/Escrow.sol/Escrow';

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function buildEscrow(escrowContract, arbiter, beneficiary, value, isApproved, signer) {
  return {
    address: escrowContract.address,
    arbiter,
    beneficiary,
    isApproved,
    value: value.toString(),
    handleApprove: async () => {
      escrowContract.on('Approved', () => {
        document.getElementById(escrowContract.address).className =
          'complete';
        document.getElementById(escrowContract.address).innerText =
          "✓ It's been approved!";
      });

      await approve(escrowContract, signer);
    },
  };
}

export async function fetchContracts(contractsArray, signer, escrows, setEscrows) {
  const retrievedEscrows = await Promise.all(
    contractsArray.map(async(contractAddress) => {
      const deployedContract = new ethers.Contract(contractAddress, EscrowJson.abi, signer)

      const arbiter = await deployedContract.arbiter();
      const beneficiary = await deployedContract.beneficiary();
      const value = await deployedContract.provider.getBalance(contractAddress);
      const isApproved = await deployedContract.isApproved()
      
      return buildEscrow(deployedContract, arbiter, beneficiary, value, isApproved, signer)
    })
  )

  setEscrows([...escrows, ...retrievedEscrows])
}

export function getContractsList() {
  return JSON.parse(localStorage.getItem('deployedContracts')) || []
}

export function updateContractsList(contract) {
  const storedContracts = getContractsList();

  storedContracts.push(contract)

  localStorage.setItem('deployedContracts', JSON.stringify(storedContracts))
}