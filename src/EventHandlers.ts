/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */

import {
  updateCreateLiquidatorAccount,
  updateCreateLiquidatedAccount,
  updateCreateProtocol,
  updateCreateCtokenRepaid,
  updateCreateCtokenSeized,
  updateCreateAccountWin,
  updateCreateAccountLoss,
  getProtocol
} from "./Utils"

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
    loaders: {
      loadCtoken: { loadParentProtocol: true },
      loadLiquidatorAccountWon: true
    },
  });

  const tokenlostID: string = liquidatedAddress.concat(ctokenSeizedAddress);
  context.accountloss.load(tokenlostID, {
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


