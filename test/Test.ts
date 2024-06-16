import assert from "assert";
import { 
  TestHelpers,
  EventsSummaryEntity,
  Comptroller_MarketDelistedEntity
} from "generated";
const { MockDb, Comptroller, Addresses } = TestHelpers;

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";


const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  comptroller_MarketDelistedCount: BigInt(0),
  comptroller_MarketListedCount: BigInt(0),
};

describe("Comptroller contract MarketDelisted event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock Comptroller contract MarketDelisted event
  const mockComptrollerMarketDelistedEvent = Comptroller.MarketDelisted.createMockEvent({
    cToken: Addresses.defaultAddress,
    force: false,
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = Comptroller.MarketDelisted.processEvent({
    event: mockComptrollerMarketDelistedEvent,
    mockDb: mockDbFinal,
  });

  it("Comptroller_MarketDelistedEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualComptrollerMarketDelistedEntity = mockDbUpdated.entities.Comptroller_MarketDelisted.get(
      mockComptrollerMarketDelistedEvent.transactionHash +
        mockComptrollerMarketDelistedEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedComptrollerMarketDelistedEntity: Comptroller_MarketDelistedEntity = {
      id:
        mockComptrollerMarketDelistedEvent.transactionHash +
        mockComptrollerMarketDelistedEvent.logIndex.toString(),
      cToken: mockComptrollerMarketDelistedEvent.params.cToken,
      force: mockComptrollerMarketDelistedEvent.params.force,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualComptrollerMarketDelistedEntity, expectedComptrollerMarketDelistedEntity, "Actual ComptrollerMarketDelistedEntity should be the same as the expectedComptrollerMarketDelistedEntity");
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      comptroller_MarketDelistedCount: MOCK_EVENTS_SUMMARY_ENTITY.comptroller_MarketDelistedCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventsSummaryEntity, expectedEventsSummaryEntity, "Actual ComptrollerMarketDelistedEntity should be the same as the expectedComptrollerMarketDelistedEntity");
  });
});
