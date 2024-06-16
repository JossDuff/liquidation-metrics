/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
// import { v4 as uuidv4 } from "uuid";
 
import {
  ComptrollerContract,
  CtokenContract,
  CtokenStatusEntity,
  LiquidationEntity
} from "generated";

CtokenContract.LiquidateBorrow.loader(({event, context}) => {
  context.CtokenStatus.load(event.srcAddress);
});

CtokenContract.LiquidateBorrow.handler(({event, context}) => {
  let ctokenStatus = context.CtokenStatus.get(event.srcAddress);
  if (!ctokenStatus?.isListed) {
    return;
  }

  const id = parseInt(event.blockNumber.toString() + event.transactionIndex.toString());

  const newLiquidationEntity: LiquidationEntity = {
    id: id.toString(),
    chainID: event.chainId,
    blockNumber: event.blockNumber,
    sourceAddress: event.srcAddress,
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
  const ctokenAddr = event.params.cToken;
  const ctokenEntity: CtokenStatusEntity = {
    id: ctokenAddr,
    isListed: false
  }

  context.CtokenStatus.set(ctokenEntity)
});

ComptrollerContract.MarketListed.loader(({ event, context }) => {
  // context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
  const ctokenAddr = event.params.cToken;
  context.contractRegistration.addCtoken(ctokenAddr);
});

ComptrollerContract.MarketListed.handler(({ event, context }) => {
  const ctokenAddr = event.params.cToken;
  const ctokenEntity: CtokenStatusEntity = {
    id: ctokenAddr,
    isListed: true
  }

  context.CtokenStatus.set(ctokenEntity)
});
