/*
*Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
*/

import {
  CDAIContract_LiquidateBorrow_loader,
  CDAIContract_LiquidateBorrow_handler,
} from "../generated/src/Handlers.gen";


import { liquidatorEntity } from "../generated/src/Types.gen";
import { CDAI } from "./src/Converters.bs";

// MyAwesomeContractContract_AwesomeEvent_loader(({ event, context }) => {
//   context.awesomeEntity.load(event.params.identifier)
// });

CDAIContract_LiquidateBorrow_loader(({ event, context }) => {
  // load the required liquidator entity
  context.liquidator.load(event.params.liquidator.toString());
});

CDAIContract_LiquidateBorrow_handler(({ event, context }) => {

  let liquidator = context.liquidator.get(event.params.liquidator.toString());

  if (!!liquidator) {
    const updatedLiquidator = {
      id: liquidator.id,
    }
    context.liquidator.set(updatedLiquidator);
  } else {
    const liquidatorObject = {
      id: event.params.liquidator.toString(),
    }
    context.liquidator.set(liquidatorObject);
  }
});

