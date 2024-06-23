/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
// import { v4 as uuidv4 } from "uuid";

import {
  ComptrollerContract,
  CtokenContract,
  CtokenEntity,
  LiquidationEntity
} from "generated";

CtokenContract.LiquidateBorrow.loader(({ event, context }) => {
  context.Ctoken.load(event.srcAddress);
});

CtokenContract.LiquidateBorrow.handler(({ event, context }) => {
  let ctoken = context.Ctoken.get(event.srcAddress);
  // if (!ctoken?.isListed) {
  //   return;
  // }

  if (!ctoken) {
    throw new Error("ctoken " + event.srcAddress + " not found");
  }
  const comptrollerAddress = ctoken?.comptroller.toLowerCase();


  const id = event.blockNumber.toString() + event.transactionIndex.toString() + event.chainId.toString();

  const newLiquidationEntity: LiquidationEntity = {
    id: id,
    chainID: event.chainId,
    blockNumber: event.blockNumber,
    sourceAddress: event.srcAddress,
    comptrollerAddress: comptrollerAddress,
    liquidatorAddress: event.params.liquidator,
    borrowerAddress: event.params.borrower,
    repayAmount: event.params.repayAmount,
    cTokenCollateralAddress: event.params.cTokenCollateral,
    seizeTokens: event.params.seizeTokens
  }

  context.Liquidation.set(newLiquidationEntity);
});

ComptrollerContract.MarketDelisted.loader(({ event, context }) => {
});

ComptrollerContract.MarketDelisted.handler(({ event, context }) => {
  const id = event.params.cToken + event.chainId;
  const ctokenEntity: CtokenEntity = {
    id: id,
    address: event.params.cToken,
    comptroller: event.srcAddress.toLowerCase(),
    isListed: false
  }

  context.Ctoken.set(ctokenEntity)
});

ComptrollerContract.MarketListed.loader(({ event, context }) => {
  const ctokenAddr = event.params.cToken;
  context.contractRegistration.addCtoken(ctokenAddr);
});

ComptrollerContract.MarketListed.handler(({ event, context }) => {
  const ctokenAddr = event.params.cToken;
  const ctokenEntity: CtokenEntity = {
    id: ctokenAddr,
    address: event.params.cToken,
    comptroller: event.srcAddress.toLowerCase(),
    isListed: true
  }

  context.Ctoken.set(ctokenEntity)
});
