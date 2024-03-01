import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0x13dab8d8F442C4aC5E5E3CDC1F36dFe49627c5df",
        abi as any,
        signer
    );
}