/*
*Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
*/

import {
  CDAIContract_LiquidateBorrow_loader,
  CDAIContract_LiquidateBorrow_handler,
} from "../generated/src/Handlers.gen";


import {
  liquidatorAccountEntity,
  liquidatedAccountEntity,
  tokenWonEntity,
  tokenLostEntity,
} from "../generated/src/Types.gen";
import { CDAI } from "./src/Converters.bs";

// MyAwesomeContractContract_AwesomeEvent_loader(({ event, context }) => {
//   context.awesomeEntity.load(event.params.identifier)
// });

CDAIContract_LiquidateBorrow_loader(({ event, context }) => {
  let liquidatorAddress: string = event.params.liquidator.toString();
  let liquidatedAddress: string = event.params.borrower.toString();
  let ctokenAddress: string = event.params.cTokenCollateral.toString();
  let tokenWonID: string = liquidatorAddress.concat(ctokenAddress);
  let tokenLostID: string = liquidatedAddress.concat(ctokenAddress);

  context.liquidatorAccount.load(liquidatorAddress);
  context.liquidatedAccount.load(liquidatedAddress);
  context.tokenWon.load(tokenWonID, { loaders: { loadLiquidatorAccount: true } });
  context.tokenLost.load(tokenLostID, { loaders: { loadLiquidatedAccount: true } });
});

CDAIContract_LiquidateBorrow_handler(({ event, context }) => {
  let liquidatorAddress: string = event.params.liquidator.toString();
  let liquidatedAddress: string = event.params.borrower.toString();

  context.log.debug(`processing liquidator ${liquidatorAddress}`);
  // update/create liquidator
  let liquidatorAccount = context.liquidatorAccount.get(liquidatorAddress);
  if (!!liquidatorAccount) {
    const updatedLiquidatorAccount: liquidatorAccountEntity = {
      id: liquidatorAccount.id,
      numberLiquidations: liquidatorAccount.numberLiquidations + 1
    }
    context.liquidatorAccount.set(updatedLiquidatorAccount);
  } else {
    const liquidatorAccountObject: liquidatorAccountEntity = {
      id: liquidatorAddress,
      numberLiquidations: 1
    }
    context.liquidatorAccount.set(liquidatorAccountObject);
  }

  context.log.debug(`processing liquidated ${liquidatedAddress}`);
  // update/create liquidatedAccount
  let liquidatedAccount = context.liquidatedAccount.get(liquidatedAddress);
  if (!!liquidatedAccount) {
    const updatedLiquidatedAccount: liquidatedAccountEntity = {
      id: liquidatedAccount.id,
      numberLiquidations: liquidatedAccount.numberLiquidations + 1
    }
    context.liquidatedAccount.set(updatedLiquidatedAccount);
  } else {
    const liquidatedAccountObject: liquidatedAccountEntity = {
      id: liquidatedAddress,
      numberLiquidations: 1
    }
    context.liquidatedAccount.set(liquidatedAccountObject);
  }


  let ctokenAddress: string = event.params.cTokenCollateral.toString();
  let tokenWonID: string = liquidatorAddress.concat(ctokenAddress);
  let tokenLostID: string = liquidatedAddress.concat(ctokenAddress);

  // update/create TokenWon
  let tokenWon = context.tokenWon.get(tokenWonID);
  if (!!tokenWon) {
    const updatedTokenWon: tokenWonEntity = {
      id: tokenWon.id,
      ctoken: tokenWon.ctoken,
      liquidatorAccount: tokenWon.liquidatorAccount,
      amountWon: tokenWon.amountWon + event.params.seizeTokens
    }
    context.tokenWon.set(updatedTokenWon)
  }
  else {
    const tokenWonObject: tokenWonEntity = {
      id: tokenWonID,
      ctoken: ctokenAddress,
      liquidatorAccount: liquidatorAddress,
      amountWon: event.params.seizeTokens
    }
    context.tokenWon.set(tokenWonObject)
  }

  // update/create TokenLost
  let tokenLost = context.tokenLost.get(tokenLostID);
  if (!!tokenLost) {
    const updatedTokenLost: tokenLostEntity = {
      id: tokenLost.id,
      ctoken: tokenLost.ctoken,
      liquidatedAccount: tokenLost.liquidatedAccount,
      amountLost: tokenLost.amountLost + event.params.seizeTokens
    }
    context.tokenLost.set(updatedTokenLost)
  }
  else {
    const tokenLostObject: tokenLostEntity = {
      id: tokenLostID,
      ctoken: ctokenAddress,
      liquidatedAccount: liquidatedAddress,
      amountLost: event.params.seizeTokens
    }
    context.tokenLost.set(tokenLostObject)
  }
});

