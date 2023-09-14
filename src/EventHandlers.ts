/*
*Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
*/

import {
  CDAIContract_LiquidateBorrow_loader,
  CDAIContract_LiquidateBorrow_handler,
} from "../generated/src/Handlers.gen";


import {
  liquidatorEntity,
  liquidateeEntity,
  tokenWonEntity,
  tokenLostEntity,
  tokenWonLoaderConfig,
  tokenLostLoaderConfig
} from "../generated/src/Types.gen";
import { CDAI } from "./src/Converters.bs";

// MyAwesomeContractContract_AwesomeEvent_loader(({ event, context }) => {
//   context.awesomeEntity.load(event.params.identifier)
// });

CDAIContract_LiquidateBorrow_loader(({ event, context }) => {
  let liquidatorAddress: string = event.params.liquidator.toString();
  let liquidateeAddress: string = event.params.borrower.toString();
  let ctokenAddress: string = event.params.cTokenCollateral.toString();
  let tokenWonID: string = liquidatorAddress.concat(ctokenAddress);
  let tokenLostID: string = liquidateeAddress.concat(ctokenAddress);

  context.liquidator.load(liquidatorAddress);
  context.liquidatee.load(liquidateeAddress);
  context.tokenWon.load(tokenWonID, { loaders: { loadLiquidator: true } });
  context.tokenLost.load(tokenLostID, { loaders: { loadLiquidatee: true } });
});

CDAIContract_LiquidateBorrow_handler(({ event, context }) => {
  let liquidatorAddress: string = event.params.liquidator.toString();
  let liquidateeAddress: string = event.params.borrower.toString();
  let ctokenAddress: string = event.params.cTokenCollateral.toString();
  let tokenWonID: string = liquidatorAddress.concat(ctokenAddress);
  let tokenLostID: string = liquidateeAddress.concat(ctokenAddress);

  // update/create liquidator
  let liquidator = context.liquidator.get(liquidatorAddress);
  if (!!liquidator) {
    const updatedLiquidator = {
      id: liquidator.id,
      numberLiquidations: liquidator.numberLiquidations + 1
    }
    context.liquidator.set(updatedLiquidator);
  } else {
    const liquidatorObject = {
      id: event.params.liquidator.toString(),
      numberLiquidations: 1
    }
    context.liquidator.set(liquidatorObject);
  }

  // update/create liquidatee
  let liquidatee = context.liquidatee.get(liquidateeAddress);
  if (!!liquidatee) {
    const updatedLiquidatee = {
      id: liquidatee.id,
      numberLiquidations: liquidatee.numberLiquidations + 1
    }
    context.liquidatee.set(updatedLiquidatee);
  } else {
    const liquidateeObject = {
      id: event.params.borrower.toString(),
      numberLiquidations: 1
    }
    context.liquidatee.set(liquidateeObject);
  }

  // update/create TokenWon
  let tokenWon = context.tokenWon.get(tokenWonID);
  if (!!tokenWon) {
    const updatedTokenWon = {
      id: tokenWon.id,
      ctoken: event.params.cTokenCollateral,
      liquidator: tokenWon.liquidator,
      amountWon: tokenWon.amountWon + event.params.seizeTokens
    }
    context.tokenWon.set(updatedTokenWon)
  }
  else { // TODO}
    // is this slow?  Could I just set this to liquidatorAddress instead?
  });

