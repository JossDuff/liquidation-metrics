/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */

import { protocolMap } from "./ProtocolDirectory";

import {
  CtokenEthereumContract_LiquidateBorrow_loader,
  CtokenEthereumContract_LiquidateBorrow_handler,
  CtokenOptimismContract_LiquidateBorrow_loader,
  CtokenOptimismContract_LiquidateBorrow_handler,
  CtokenAvalancheContract_LiquidateBorrow_loader,
  CtokenAvalancheContract_LiquidateBorrow_handler,
  CtokenBinanceContract_LiquidateBorrow_loader,
  CtokenBinanceContract_LiquidateBorrow_handler,
} from "../generated/src/Handlers.gen";

import {
  liquidatoraccountEntity,
  liquidatedaccountEntity,
  accountwinEntity,
  accountlossEntity,
  ctokenEntity,
  protocolEntity,
  eventLog,
  CtokenEthereumContract_LiquidateBorrowEvent_eventArgs,
  CtokenOptimismContract_LiquidateBorrowEvent_eventArgs,
  CtokenAvalancheContract_LiquidateBorrowEvent_eventArgs,
  CtokenBinanceContract_LiquidateBorrowEvent_eventArgs,
  CtokenEthereumContract_LiquidateBorrowEvent_loaderContext,
  CtokenOptimismContract_LiquidateBorrowEvent_loaderContext,
  CtokenAvalancheContract_LiquidateBorrowEvent_loaderContext,
  CtokenBinanceContract_LiquidateBorrowEvent_loaderContext,
  CtokenEthereumContract_LiquidateBorrowEvent_context,
  CtokenOptimismContract_LiquidateBorrowEvent_context,
  CtokenAvalancheContract_LiquidateBorrowEvent_context,
  CtokenBinanceContract_LiquidateBorrowEvent_context
} from "../generated/src/Types.gen";
import { liquidatedaccountEntity_decode } from "./src/Types.bs";
// import { Ctoken } from "./src/Converters.bs";

// MyAwesomeContractContract_AwesomeEvent_loader(({ event, context }) => {
//   context.awesomeEntity.load(event.params.identifier)
// });

CtokenEthereumContract_LiquidateBorrow_loader(({ event, context }) => {
  chainAgnostic_LiquidateBorrow_Loader(event, context);
});
CtokenOptimismContract_LiquidateBorrow_loader(({ event, context }) => {
  chainAgnostic_LiquidateBorrow_Loader(event, context);
});
CtokenAvalancheContract_LiquidateBorrow_loader(({ event, context }) => {
  chainAgnostic_LiquidateBorrow_Loader(event, context);
});
CtokenBinanceContract_LiquidateBorrow_loader(({ event, context }) => {
  chainAgnostic_LiquidateBorrow_Loader(event, context);
});

function chainAgnostic_LiquidateBorrow_Loader(
  event:
    eventLog<CtokenEthereumContract_LiquidateBorrowEvent_eventArgs> |
    eventLog<CtokenOptimismContract_LiquidateBorrowEvent_eventArgs> |
    eventLog<CtokenAvalancheContract_LiquidateBorrowEvent_eventArgs> |
    eventLog<CtokenBinanceContract_LiquidateBorrowEvent_eventArgs>,
  context:
    CtokenEthereumContract_LiquidateBorrowEvent_loaderContext |
    CtokenOptimismContract_LiquidateBorrowEvent_loaderContext |
    CtokenAvalancheContract_LiquidateBorrowEvent_loaderContext |
    CtokenBinanceContract_LiquidateBorrowEvent_loaderContext
) {

  const liquidatorAddress: string = event.params.liquidator.toString();
  context.liquidatoraccount.load(liquidatorAddress);

  const liquidatedAddress: string = event.params.borrower.toString();
  context.liquidatedaccount.load(liquidatedAddress);

  const ctokenRepaidAddress: string = event.srcAddress.toString();
  context.ctoken.load(ctokenRepaidAddress, {
    loaders: { loadParentProtocol: true },
  });

  const ctokenSeizedAddress: string = event.params.cTokenCollateral.toString();
  context.ctoken.load(ctokenSeizedAddress, {
    loaders: { loadParentProtocol: true },
  });

  const protocol = getProtocol(event.srcAddress);
  const protocolID = protocol.name.concat(protocol.chain);
  context.protocol.load(protocolID);

  const liquidatoraccountwinID: string = liquidatorAddress.concat(ctokenSeizedAddress);
  context.accountwin.load(liquidatoraccountwinID, {
    // TODO: do I need to load all this?
    loaders: {
      loadCtoken: { loadParentProtocol: true },
      loadLiquidatorAccountWon: true
    },
  });

  const tokenlostID: string = liquidatedAddress.concat(ctokenSeizedAddress);
  context.accountloss.load(tokenlostID, {
    // TODO: do I need to load all this?
    loaders: {
      loadCtoken: { loadParentProtocol: true },
      loadLiquidatedAccountLost: true
    },
  });
}

CtokenEthereumContract_LiquidateBorrow_handler(({ event, context }) => {
  chainAgnostic_LiquidateBorrow_Handler(event, context);
});
CtokenOptimismContract_LiquidateBorrow_handler(({ event, context }) => {
  chainAgnostic_LiquidateBorrow_Handler(event, context);
});
CtokenAvalancheContract_LiquidateBorrow_handler(({ event, context }) => {
  chainAgnostic_LiquidateBorrow_Handler(event, context);
});
CtokenBinanceContract_LiquidateBorrow_handler(({ event, context }) => {
  chainAgnostic_LiquidateBorrow_Handler(event, context);
});

function chainAgnostic_LiquidateBorrow_Handler(
  event:
    eventLog<CtokenEthereumContract_LiquidateBorrowEvent_eventArgs> |
    eventLog<CtokenOptimismContract_LiquidateBorrowEvent_eventArgs> |
    eventLog<CtokenAvalancheContract_LiquidateBorrowEvent_eventArgs> |
    eventLog<CtokenBinanceContract_LiquidateBorrowEvent_eventArgs>,
  context:
    CtokenEthereumContract_LiquidateBorrowEvent_context |
    CtokenOptimismContract_LiquidateBorrowEvent_context |
    CtokenAvalancheContract_LiquidateBorrowEvent_context |
    CtokenBinanceContract_LiquidateBorrowEvent_context
) {
  const seizeAmount = event.params.seizeTokens;
  const repayAmount = event.params.repayAmount;

  // update/create liquidator Account
  const liquidatorAccountAddress: string = event.params.liquidator.toString();
  const liquidatorAccount = context.liquidatoraccount.get(liquidatorAccountAddress);
  const updatedLiquidatorAccount = updateCreateLiquidatorAccount(liquidatorAccount, liquidatorAccountAddress);
  context.liquidatoraccount.set(updatedLiquidatorAccount);

  // update/create liquidated Account
  const liquidatedAccountAddress: string = event.params.borrower.toString();
  const liquidatedAccount = context.liquidatedaccount.get(liquidatedAccountAddress);
  const updatedLiquidatedAccount = updateCreateLiquidatedAccount(liquidatedAccount, liquidatedAccountAddress);
  context.liquidatedaccount.set(updatedLiquidatedAccount);

  // update/create protocol
  const protocolData = getProtocol(event.srcAddress);
  const protocolID: string = protocolData.name.concat(protocolData.chain);
  const protocol = context.protocol.get(protocolID);
  const updatedProtocol = updateCreateProtocol(protocol, protocolID, protocolData);
  context.protocol.set(updatedProtocol);

  // update/create ctoken (repaid)
  const ctokenRepaidAddress: string = event.srcAddress.toString();
  const ctokenRepaid = context.ctoken.get(ctokenRepaidAddress);
  const updatedCtokenRepaid = updateCreateCtokenRepaid(ctokenRepaid, ctokenRepaidAddress, repayAmount, protocolID);
  context.ctoken.set(updatedCtokenRepaid);

  // update/create ctoken (seized)
  const ctokenSeizedAddress: string = event.params.cTokenCollateral.toString();
  const ctokenSeized = context.ctoken.get(ctokenSeizedAddress);
  const updatedCtokenSeized = updateCreateCtokenSeized(ctokenSeized, ctokenSeizedAddress, seizeAmount, protocolID);
  context.ctoken.set(updatedCtokenSeized);

  // update/create accountwin
  const accountWinID: string = liquidatorAccountAddress.concat(ctokenSeizedAddress);
  const accountWin = context.accountwin.get(accountWinID);
  const updatedAccountWin = updateCreateAccountWin(accountWin, accountWinID, seizeAmount, ctokenSeizedAddress, liquidatorAccountAddress);
  context.accountwin.set(updatedAccountWin);

  // update/create accountloss
  const accountLossID: string = liquidatedAccountAddress.concat(ctokenSeizedAddress);
  const accountLoss = context.accountloss.get(accountLossID);
  const updatedAccountLoss = updateCreateAccountLoss(accountLoss, accountLossID, seizeAmount, ctokenSeizedAddress, liquidatedAccountAddress);
  context.accountloss.set(updatedAccountLoss);
}

// helper function to get protocol name and chain given a ctoken's address
// utilizes mapping in src/ProtocolDirectory.ts
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
      chain: protocol.chain,
      numberLiquidations: protocol.numberLiquidations + 1,
    };
    return updatedProtocol;
  } else {
    const newProtocol: protocolEntity = {
      id: protocolID,
      name: protocolData.name,
      chain: protocolData.chain,
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
