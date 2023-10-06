import { protocolMap } from "./ProtocolDirectory";

import {
    liquidatoraccountEntity,
    liquidatedaccountEntity,
    accountwinEntity,
    accountlossEntity,
    ctokenEntity,
    protocolEntity,
} from "../generated/src/Types.gen";

// helper function to get protocol name and chain given a ctoken's address
// utilizes mapping from src/ProtocolDirectory.ts
function getProtocol(ctokenAddress: string): { name: string, chain: string } {
    let protocol = protocolMap.get(ctokenAddress);
    if (!!protocol) {
        return protocol;
    }
    else {
        throw new Error("An address is in config.yaml that isn't associated with a protocol in ProtocolDirectory.ts");
    }
}

function updateCreateLiquidatorAccount(
    liquidatorAccount: liquidatoraccountEntity | undefined,
    liquidatorAccountAddress: string
): liquidatoraccountEntity {
    if (!!liquidatorAccount) {
        const updatedLiquidatorAccount: liquidatoraccountEntity = {
            id: liquidatorAccount.id,
            numberLiquidations: liquidatorAccount.numberLiquidations + 1,
        };
        return updatedLiquidatorAccount;
    } else {
        const liquidatorAccountObject: liquidatoraccountEntity = {
            id: liquidatorAccountAddress,
            numberLiquidations: 1,
        };
        return liquidatorAccountObject;
    }
}

function updateCreateLiquidatedAccount(
    liquidatedAccount: liquidatedaccountEntity | undefined,
    liquidatedAccountAddress: string
): liquidatedaccountEntity {
    if (!!liquidatedAccount) {
        const updatedLiquidatedAccount: liquidatedaccountEntity = {
            id: liquidatedAccount.id,
            numberLiquidations: liquidatedAccount.numberLiquidations + 1,
        };
        return updatedLiquidatedAccount;
    } else {
        const liquidatedAccountObject: liquidatedaccountEntity = {
            id: liquidatedAccountAddress,
            numberLiquidations: 1,
        };
        return liquidatedAccountObject;
    }
}

function updateCreateProtocol(
    protocol: protocolEntity | undefined,
    protocolID: string,
    protocolData: { name: string, chain: string }
): protocolEntity {
    if (protocol) {
        const updatedProtocol: protocolEntity = {
            id: protocol.id,
            name: protocol.name,
            numberLiquidations: protocol.numberLiquidations + 1,
        };
        return updatedProtocol;
    } else {
        const newProtocol: protocolEntity = {
            id: protocolID,
            name: protocolData.name,
            numberLiquidations: 1
        };
        return newProtocol;
    }
}

function updateCreateCtokenRepaid(
    ctokenRepaid: ctokenEntity | undefined,
    ctokenRepaidAddress: string,
    repayAmount: bigint,
    parentProtocolID: string
): ctokenEntity {
    if (!!ctokenRepaid) {
        const updatedCtoken: ctokenEntity = {
            id: ctokenRepaid.id,
            totalRepaid: ctokenRepaid.totalRepaid + repayAmount,
            totalSeized: ctokenRepaid.totalSeized,
            timesAsRepay: ctokenRepaid.timesAsRepay + 1,
            timesAsSeize: ctokenRepaid.timesAsSeize,
            parentProtocol: ctokenRepaid.parentProtocol,
        }
        return updatedCtoken;
    } else {
        const newCtoken: ctokenEntity = {
            id: ctokenRepaidAddress,
            totalRepaid: repayAmount,
            totalSeized: BigInt(0),
            timesAsRepay: 1,
            timesAsSeize: 0,
            parentProtocol: parentProtocolID
        }
        return newCtoken;
    }
}

function updateCreateCtokenSeized(
    ctokenSeized: ctokenEntity | undefined,
    ctokenSeizedAddress: string,
    seizeAmount: bigint,
    parentProtocolID: string
): ctokenEntity {
    if (!!ctokenSeized) {
        const updatedCtoken: ctokenEntity = {
            id: ctokenSeized.id,
            totalRepaid: ctokenSeized.totalRepaid,
            totalSeized: ctokenSeized.totalSeized + seizeAmount,
            timesAsRepay: ctokenSeized.timesAsRepay,
            timesAsSeize: ctokenSeized.timesAsSeize + 1,
            parentProtocol: ctokenSeized.parentProtocol,
        }
        return updatedCtoken;
    } else {
        const newCtoken: ctokenEntity = {
            id: ctokenSeizedAddress,
            totalRepaid: BigInt(0),
            totalSeized: seizeAmount,
            timesAsRepay: 0,
            timesAsSeize: 1,
            parentProtocol: parentProtocolID
        }
        return newCtoken;
    }
}

function updateCreateAccountWin(
    accountWin: accountwinEntity | undefined,
    accountWinID: string,
    seizeAmount: bigint,
    ctokenSeizedAddress: string,
    liquidatorAccountAddress: string,
): accountwinEntity {
    if (!!accountWin) {
        const updatedAccountWin: accountwinEntity = {
            id: accountWin.id,
            ctoken: accountWin.ctoken,
            liquidatorAccountWon: accountWin.liquidatorAccountWon,
            amountWon: accountWin.amountWon + seizeAmount,
        };
        return updatedAccountWin;
    } else {
        const newAccountWin: accountwinEntity = {
            id: accountWinID,
            ctoken: ctokenSeizedAddress,
            liquidatorAccountWon: liquidatorAccountAddress,
            amountWon: seizeAmount,
        };
        return newAccountWin;
    }
}

function updateCreateAccountLoss(
    accountLoss: accountlossEntity | undefined,
    accountLossID: string,
    seizeAmount: bigint,
    ctokenSeizedAddress: string,
    liquidatedAccountAddress: string,
): accountlossEntity {
    if (!!accountLoss) {
        const updatedAccountLoss: accountlossEntity = {
            id: accountLoss.id,
            ctoken: accountLoss.ctoken,
            liquidatedAccountLost: accountLoss.liquidatedAccountLost,
            amountLost: accountLoss.amountLost + seizeAmount,
        };
        return updatedAccountLoss;
    } else {
        const newAccountLoss: accountlossEntity = {
            id: accountLossID,
            ctoken: ctokenSeizedAddress,
            liquidatedAccountLost: liquidatedAccountAddress,
            amountLost: seizeAmount,
        };
        return newAccountLoss;
    }
}

export {
    updateCreateLiquidatorAccount,
    updateCreateLiquidatedAccount,
    updateCreateProtocol,
    updateCreateCtokenRepaid,
    updateCreateCtokenSeized,
    updateCreateAccountWin,
    updateCreateAccountLoss,
    getProtocol
};
