/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */

import {
  CtokenContract_LiquidateBorrow_loader,
  CtokenContract_LiquidateBorrow_handler,
} from "../generated/src/Handlers.gen";

import {
  liquidatoraccountEntity,
  liquidatedaccountEntity,
  tokenwonEntity,
  tokenlostEntity,
  ctokenEntity,
} from "../generated/src/Types.gen";
// import { Ctoken } from "./src/Converters.bs";

// MyAwesomeContractContract_AwesomeEvent_loader(({ event, context }) => {
//   context.awesomeEntity.load(event.params.identifier)
// });

CtokenContract_LiquidateBorrow_loader(({ event, context }) => {
  const liquidatorAddress: string = event.params.liquidator.toString();
  context.liquidatoraccount.load(liquidatorAddress);

  const liquidatedAddress: string = event.params.borrower.toString();
  context.liquidatedaccount.load(liquidatedAddress);

  const ctokenRepaidAddress: string = event.srcAddress.toString();
  context.ctoken.load(ctokenRepaidAddress);

  const ctokenSeizedAddress: string = event.params.cTokenCollateral.toString();
  context.ctoken.load(ctokenSeizedAddress);

  const tokenwonID: string = liquidatorAddress.concat(ctokenSeizedAddress);
  context.tokenwon.load(tokenwonID, {
    loaders: { loadLiquidatorAccountWon: true },
  });

  const tokenlostID: string = liquidatedAddress.concat(ctokenSeizedAddress);
  context.tokenlost.load(tokenlostID, {
    loaders: { loadLiquidatedAccountLost: true },
  });
});


CtokenContract_LiquidateBorrow_handler(({ event, context }) => {
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

  // update/create ctoken (repaid)
  const ctokenRepaidAddress: string = event.srcAddress.toString();
  const ctokenRepaid = context.ctoken.get(ctokenRepaidAddress);
  const updatedCtokenRepaid = updateCreateCtokenRepaid(ctokenRepaid, ctokenRepaidAddress, repayAmount);
  context.ctoken.set(updatedCtokenRepaid);

  // update/create ctoken (seized)
  const ctokenSeizedAddress: string = event.params.cTokenCollateral.toString();
  const ctokenSeized = context.ctoken.get(ctokenSeizedAddress);
  const updatedCtokenSeized = updateCreateCtokenSeized(ctokenSeized, ctokenSeizedAddress, seizeAmount);
  context.ctoken.set(updatedCtokenSeized);

  // update/create tokenwon
  const tokenWonID: string = liquidatorAccountAddress.concat(ctokenSeizedAddress);
  const tokenWon = context.tokenwon.get(tokenWonID);
  const updatedTokenWon = updateCreateTokenWon(tokenWon, tokenWonID, seizeAmount, ctokenSeizedAddress, liquidatorAccountAddress);
  context.tokenwon.set(updatedTokenWon);

  // update/create tokenlost
  const tokenLostID: string = liquidatedAccountAddress.concat(ctokenSeizedAddress);
  const tokenLost = context.tokenlost.get(tokenLostID);
  const updatedTokenLost = updateCreateTokenLost(tokenLost, tokenLostID, seizeAmount, ctokenSeizedAddress, liquidatedAccountAddress);
  context.tokenlost.set(updatedTokenLost);
});


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

function updateCreateCtokenRepaid(
  ctokenRepaid: ctokenEntity | undefined,
  ctokenRepaidAddress: string,
  repayAmount: bigint
): ctokenEntity {
  if (!!ctokenRepaid) {
    const updatedCtoken: ctokenEntity = {
      id: ctokenRepaid.id,
      totalRepaid: ctokenRepaid.totalRepaid + repayAmount,
      totalSeized: ctokenRepaid.totalSeized,
      timesAsRepay: ctokenRepaid.timesAsRepay + 1,
      timesAsSeize: ctokenRepaid.timesAsSeize,
    }
    return updatedCtoken;
  } else {
    const newCtoken: ctokenEntity = {
      id: ctokenRepaidAddress,
      totalRepaid: repayAmount,
      totalSeized: BigInt(0),
      timesAsRepay: 1,
      timesAsSeize: 0,
    }
    return newCtoken;
  }
}

function updateCreateCtokenSeized(
  ctokenSeized: ctokenEntity | undefined,
  ctokenSeizedAddress: string,
  seizeAmount: bigint
): ctokenEntity {
  if (!!ctokenSeized) {
    const updatedCtoken: ctokenEntity = {
      id: ctokenSeized.id,
      totalRepaid: ctokenSeized.totalRepaid,
      totalSeized: ctokenSeized.totalSeized + seizeAmount,
      timesAsRepay: ctokenSeized.timesAsRepay,
      timesAsSeize: ctokenSeized.timesAsSeize + 1,
    }
    return updatedCtoken;
  } else {
    const newCtoken: ctokenEntity = {
      id: ctokenSeizedAddress,
      totalRepaid: BigInt(0),
      totalSeized: seizeAmount,
      timesAsRepay: 0,
      timesAsSeize: 1,
    }
    return newCtoken;
  }
}

function updateCreateTokenWon(
  tokenWon: tokenwonEntity | undefined,
  tokenWonID: string,
  seizeAmount: bigint,
  ctokenSeizedAddress: string,
  liquidatorAccountAddress: string,
): tokenwonEntity {
  if (!!tokenWon) {
    const updatedTokenWon: tokenwonEntity = {
      id: tokenWon.id,
      ctoken: tokenWon.ctoken,
      liquidatorAccountWon: tokenWon.liquidatorAccountWon,
      amountWon: tokenWon.amountWon + seizeAmount,
    };
    return updatedTokenWon;
  } else {
    const newTokenWon: tokenwonEntity = {
      id: tokenWonID,
      ctoken: ctokenSeizedAddress,
      liquidatorAccountWon: liquidatorAccountAddress,
      amountWon: seizeAmount,
    };
    return newTokenWon;
  }
}

function updateCreateTokenLost(
  tokenLost: tokenlostEntity | undefined,
  tokenLostID: string,
  seizeAmount: bigint,
  ctokenSeizedAddress: string,
  liquidatedAccountAddress: string,
): tokenlostEntity {
  if (!!tokenLost) {
    const updatedTokenLost: tokenlostEntity = {
      id: tokenLost.id,
      ctoken: tokenLost.ctoken,
      liquidatedAccountLost: tokenLost.liquidatedAccountLost,
      amountLost: tokenLost.amountLost + seizeAmount,
    };
    return updatedTokenLost;
  } else {
    const newTokenLost: tokenlostEntity = {
      id: tokenLostID,
      ctoken: ctokenSeizedAddress,
      liquidatedAccountLost: liquidatedAccountAddress,
      amountLost: seizeAmount,
    };
    return newTokenLost;
  }
}
