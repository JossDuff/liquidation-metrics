/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */

import {
  CtokenContract_LiquidateBorrow_loader,
  CtokenContract_LiquidateBorrow_handler,
  ComptrollerContract_MarketListed_loader,
  ComptrollerContract_MarketListed_handler,
} from "../generated/src/Handlers.gen";

import {
  liquidatoraccountEntity,
  liquidatedaccountEntity,
  tokenwonEntity,
  tokenlostEntity,
  ctokenEntity,
} from "../generated/src/Types.gen";
import { Ctoken } from "./src/Converters.bs"; // Am I even using this?

// MyAwesomeContractContract_AwesomeEvent_loader(({ event, context }) => {
//   context.awesomeEntity.load(event.params.identifier)
// });

ComptrollerContract_MarketListed_loader(({ event, context }) => {
  const ctoken = event.params.cToken;

  context.contractRegistration.addCtoken(ctoken);
  // console.log(`registered ctoken: ${ctoken}`);
  context.ctoken.load(ctoken);
});

ComptrollerContract_MarketListed_handler(({ event, context }) => {
  const ctokenAddress = event.params.cToken;

  let ctoken = context.ctoken.get(ctokenAddress);
  if (!ctoken) {
    const ctokenObject: ctokenEntity = {
      id: ctokenAddress,
      numberLiquidations: 0,
    }
    context.ctoken.set(ctokenObject);
  }
});

CtokenContract_LiquidateBorrow_loader(({ event, context }) => {
  const liquidatorAddress: string = event.params.liquidator;
  const liquidatedAddress: string = event.params.borrower;
  const ctokenAddress: string = event.params.cTokenCollateral;
  const tokenwonID: string = liquidatorAddress.concat(ctokenAddress);
  const tokenlostID: string = liquidatedAddress.concat(ctokenAddress);
  context.ctoken.load(ctokenAddress);
  context.liquidatoraccount.load(liquidatorAddress);
  context.liquidatedaccount.load(liquidatedAddress);
  context.tokenwon.load(tokenwonID, {
    loaders: { loadLiquidatorAccountWon: true },
  });
  context.tokenlost.load(tokenlostID, {
    loaders: { loadLiquidatedAccountLost: true },
  });
});

CtokenContract_LiquidateBorrow_handler(({ event, context }) => {
  const liquidatorAddress: string = event.params.liquidator;
  const liquidatedAddress: string = event.params.borrower;
  // context.log.debug(`processing liquidator ${liquidatorAddress}`);
  // update/create liquidator
  const liquidatorAccount = context.liquidatoraccount.get(liquidatorAddress);
  if (!!liquidatorAccount) {
    const updatedLiquidatorAccount: liquidatoraccountEntity = {
      id: liquidatorAccount.id,
      numberLiquidations: liquidatorAccount.numberLiquidations + 1,
    };
    context.liquidatoraccount.set(updatedLiquidatorAccount);
  } else {
    const liquidatorAccountObject: liquidatoraccountEntity = {
      id: liquidatorAddress,
      numberLiquidations: 1,
    };
    context.liquidatoraccount.set(liquidatorAccountObject);
  }
  // context.log.debug(`processing liquidated ${liquidatedAddress}`);
  // update/create liquidatedAccount
  const liquidatedAccount = context.liquidatedaccount.get(liquidatedAddress);
  if (!!liquidatedAccount) {
    const updatedLiquidatedAccount: liquidatedaccountEntity = {
      id: liquidatedAccount.id,
      numberLiquidations: liquidatedAccount.numberLiquidations + 1,
    };
    context.liquidatedaccount.set(updatedLiquidatedAccount);
  } else {
    const liquidatedAccountObject: liquidatedaccountEntity = {
      id: liquidatedAddress,
      numberLiquidations: 1,
    };
    context.liquidatedaccount.set(liquidatedAccountObject);
  }

  const ctokenAddress: string = event.params.cTokenCollateral;
  // update the number of liquidations this ctoken was involved in
  const ctoken = context.ctoken.get(ctokenAddress);
  if (ctoken === undefined) {
    context.log.error(`ctoken ${ctokenAddress} is undefined`);
  } else {
    let updatedctoken: ctokenEntity = {
      id: ctoken?.id,
      numberLiquidations: ctoken?.numberLiquidations + 1
    }
    context.ctoken.set(updatedctoken);
  }

  const tokenwonID: string = liquidatorAddress.concat(ctokenAddress);
  const tokenlostID: string = liquidatedAddress.concat(ctokenAddress);
  // update/create tokenwon
  const tokenwon = context.tokenwon.get(tokenwonID);
  if (!!tokenwon) {
    const updatedtokenwon: tokenwonEntity = {
      id: tokenwon.id,
      ctoken: tokenwon.ctoken,
      liquidatorAccountWon: tokenwon.liquidatorAccountWon,
      amountWon: tokenwon.amountWon + event.params.seizeTokens,
    };
    context.tokenwon.set(updatedtokenwon);
  } else {
    const tokenwonObject: tokenwonEntity = {
      id: tokenwonID,
      ctoken: ctokenAddress,
      liquidatorAccountWon: liquidatorAddress,
      amountWon: event.params.seizeTokens,
    };
    context.tokenwon.set(tokenwonObject);
  }
  // update/create tokenlost
  const tokenlost = context.tokenlost.get(tokenlostID);
  if (!!tokenlost) {
    const updatedtokenlost: tokenlostEntity = {
      id: tokenlost.id,
      ctoken: tokenlost.ctoken,
      liquidatedAccountLost: tokenlost.liquidatedAccountLost,
      amountLost: tokenlost.amountLost + event.params.seizeTokens,
    };
    context.tokenlost.set(updatedtokenlost);
  } else {
    const tokenlostObject: tokenlostEntity = {
      id: tokenlostID,
      ctoken: ctokenAddress,
      liquidatedAccountLost: liquidatedAddress,
      amountLost: event.params.seizeTokens,
    };
    context.tokenlost.set(tokenlostObject);
  }
});
