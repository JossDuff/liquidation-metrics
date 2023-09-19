/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */

import {
  CDAIContract_LiquidateBorrow_loader,
  CDAIContract_LiquidateBorrow_handler,
} from "../generated/src/Handlers.gen";

import {
  liquidatoraccountEntity,
  liquidatedaccountEntity,
  tokenwonEntity,
  tokenlostEntity,
} from "../generated/src/Types.gen";
import { CDAI } from "./src/Converters.bs";

// MyAwesomeContractContract_AwesomeEvent_loader(({ event, context }) => {
//   context.awesomeEntity.load(event.params.identifier)
// });

CDAIContract_LiquidateBorrow_loader(({ event, context }) => {
  let liquidatorAddress: string = event.params.liquidator.toString();
  let liquidatedAddress: string = event.params.borrower.toString();
  let ctokenAddress: string = event.params.cTokenCollateral.toString();
  let tokenwonID: string = liquidatorAddress.concat(ctokenAddress);
  let tokenlostID: string = liquidatedAddress.concat(ctokenAddress);
  context.liquidatoraccount.load(liquidatorAddress);
  context.liquidatedaccount.load(liquidatedAddress);
  context.tokenwon.load(tokenwonID, {
    loaders: { loadLiquidatorAccountX: true },
  });
  context.tokenlost.load(tokenlostID, {
    loaders: { loadLiquidatedAccountX: true },
  });
});

CDAIContract_LiquidateBorrow_handler(({ event, context }) => {
  // let liquidatorAddress: string = event.params.liquidator.toString();
  // let liquidatedAddress: string = event.params.borrower.toString();
  // context.log.debug(`processing liquidator ${liquidatorAddress}`);
  // // update/create liquidator
  // let liquidatorAccount = context.liquidatorAccount.get(liquidatorAddress);
  // if (!!liquidatorAccount) {
  //   const updatedLiquidatorAccount: liquidatoraccountEntity = {
  //     id: liquidatorAccount.id,
  //     numberLiquidations: liquidatorAccount.numberLiquidations + 1,
  //   };
  //   context.liquidatorAccount.set(updatedLiquidatorAccount);
  // } else {
  //   const liquidatorAccountObject: liquidatoraccountEntity = {
  //     id: liquidatorAddress,
  //     numberLiquidations: 1,
  //   };
  //   context.liquidatorAccount.set(liquidatorAccountObject);
  // }
  // context.log.debug(`processing liquidated ${liquidatedAddress}`);
  // // update/create liquidatedAccount
  // let liquidatedAccount = context.liquidatedaccount.get(liquidatedAddress);
  // if (!!liquidatedAccount) {
  //   const updatedLiquidatedAccount: liquidatedaccountEntity = {
  //     id: liquidatedAccount.id,
  //     numberLiquidations: liquidatedAccount.numberLiquidations + 1,
  //   };
  //   context.liquidatedaccount.set(updatedLiquidatedAccount);
  // } else {
  //   const liquidatedAccountObject: liquidatedaccountEntity = {
  //     id: liquidatedAddress,
  //     numberLiquidations: 1,
  //   };
  //   context.liquidatedaccount.set(liquidatedAccountObject);
  // }
  // let ctokenAddress: string = event.params.cTokenCollateral.toString();
  // let tokenwonID: string = liquidatorAddress.concat(ctokenAddress);
  // let tokenlostID: string = liquidatedAddress.concat(ctokenAddress);
  // // update/create tokenwon
  // let tokenwon = context.tokenwon.get(tokenwonID);
  // if (!!tokenwon) {
  //   const updatedtokenwon: tokenwonEntity = {
  //     id: tokenwon.id,
  //     ctoken: tokenwon.ctoken,
  //     liquidatorAccount: tokenwon.liquidatorAccount,
  //     amountWon: tokenwon.amountWon + event.params.seizeTokens,
  //   };
  //   context.tokenwon.set(updatedtokenwon);
  // } else {
  //   const tokenwonObject: tokenwonEntity = {
  //     id: tokenwonID,
  //     ctoken: ctokenAddress,
  //     liquidatorAccount: liquidatorAddress,
  //     amountWon: event.params.seizeTokens,
  //   };
  //   context.tokenwon.set(tokenwonObject);
  // }
  // // update/create tokenlost
  // let tokenlost = context.tokenlost.get(tokenlostID);
  // if (!!tokenlost) {
  //   const updatedtokenlost: tokenlostEntity = {
  //     id: tokenlost.id,
  //     ctoken: tokenlost.ctoken,
  //     liquidatedAccount: tokenlost.liquidatedAccount,
  //     amountLost: tokenlost.amountLost + event.params.seizeTokens,
  //   };
  //   context.tokenlost.set(updatedtokenlost);
  // } else {
  //   const tokenlostObject: tokenlostEntity = {
  //     id: tokenlostID,
  //     ctoken: ctokenAddress,
  //     liquidatedAccount: liquidatedAddress,
  //     amountLost: event.params.seizeTokens,
  //   };
  //   context.tokenlost.set(tokenlostObject);
  // }
});
