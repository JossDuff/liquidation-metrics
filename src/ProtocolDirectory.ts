// This allows me to go from ctoken address -> protocol name/chain
export { protocolMap };

class Protocol {
    name: string;
    chain: string;
    ctokenAddresses: string[];

    constructor(name: string, chain: string, ctokenAddresses: string[]) {
        this.name = name;
        this.chain = chain;
        this.ctokenAddresses = ctokenAddresses;
    }
}

let protocols = [
    new Protocol(
        "Compound V2",
        "1",
        [
            "0xe65cdB6479BaC1e22340E4E755fAE7E509EcD06c",
            "0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E",
            "0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4",
            "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
            "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5",
            "0x7713DD9Ca933848F6819F38B8352D9A15EA73F67",
            "0xFAce851a4921ce59e912d19329929CE6da6EB0c7",
            "0x95b4eF2869eBD94BEb4eEE400a99824BF5DC325b",
            "0x158079Ee67Fce2f58472A96584A73C7Ab9AC95c1",
            "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC",
            "0x4B0181102A0112A2ef11AbEE5563bb4a3176c9d7",
            "0x12392F67bdf24faE0AF363c24aC620a2f67DAd86",
            "0x35A18000230DA775CAc24873d00Ff85BccdeD550",
            "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
            "0x041171993284df560249B57358F931D9eB7b925D",
            "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9",
            "0xC11b1268C1A384e55C48c2391d8d480264A3A7F4",
            "0xccF4429DB6322D5C611ee964527D42E5d685DD6a",
            "0x80a2AE356fc9ef4305676f7a3E2Ed04e12C33946",
            "0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407",
        ]
    ),
    new Protocol(
        "Sonne Finance",
        "10",
        [
            "0xf7B5965f5C117Eb1B5450187c9DcFccc3C317e8E",
            "0xEC8FEa79026FfEd168cCf5C627c7f486D77b765F",
            "0x5Ff29E4470799b982408130EFAaBdeeAE7f66a10",
            "0x5569b83de187375d43FBd747598bfe64fC8f6436",
            "0x8cD6b19A07d754bF36AdEEE79EDF4F2134a8F571",
            "0xd14451E0Fa44B18f08aeB1E4a4d092B823CaCa68",
            "0xD7dAabd899D1fAbbC3A9ac162568939CEc0393Cc",
            "0x33865E09A572d4F1CC4d75Afc9ABcc5D3d4d867D",
            "0xAFdf91f120DEC93c65fd63DBD5ec372e5dcA5f82",
            "0x26AaB17f27CD1c8d06a0Ad8E4a1Af8B1032171d5",
            "0xE7De932d50EfC9ea0a7a409Fc015B4f71443528e",
        ]
    ),
    new Protocol(
        "Venus",
        "56",
        [
            "0x26DA28954763B92139ED49283625ceCAf52C6f94",
            "0x9A0AF7FDb2065Ce470D72664DE73cAE409dA28Ec",
            "0x5F0388EBc2B94FA8E123F404b79cCF5f40b29176",
            "0x972207A639CC1B374B893cc33Fa251b55CEB7c07",
            "0xA07c5b74C9B40447a954e1466938b865b6BBea36",
            "0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B",
            "0x95c78222B3D6e262426483D42CfA53685A67Ab9D",
            "0x86aC3974e2BD0d60825230fa6F355fF11409df5c",
            "0xeBD0070237a0713E8D94fEf1B728d3d993d290ef",
            "0x334b3eCB4DCa3593BCCC3c7EBD1A1C1d1780FBF1",
            "0xec3422Ef92B2fb59e84c8B02Ba73F1fE84Ed8D71",
            "0x1610bc33319e9398de5f57B33a5b184c806aD217",
            "0xf508fCD89b8bd15579dc79A6827cB4686A3592c8",
            "0xf91d58b5aE142DAcC749f58A49FCBac340Cb0343",
            "0x650b940a1033B8A1b1873f78730FcFC73ec11f1f",
            "0x57A5297F2cB2c0AaC9D554660acd6D385Ab50c6B",
            "0xb91A659E88B51474767CD97EF3196A3e7cEDD2c8",
            "0x5c9476FcD6a4F9a3654139721c949c2233bBbBc8",
            "0x2fF3d0F6990a40261c66E1ff2017aCBc282EB6d0",
            "0x2fF3d0F6990a40261c66E1ff2017aCBc282EB6d0",
            "0xC5D3466aA484B040eE977073fcF337f2c00071c1",
            "0x61eDcFe8Dd6bA3c891CB9bEc2dc7657B3B422E93",
            "0xBf762cd5991cA1DCdDaC9ae5C638F5B5Dc3Bee6E",
            "0x08CEB3F4a7ed3500cA0982bcd0FC7816688084c3",
            "0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8",
            "0xfD5840Cd36d94D7229439859C0112a4185BC0255",
            "0x78366446547D062f45b4C0f320cDaa6d710D87bb",
            "0x6CFdEc747f37DAf3b87a35a1D9c8AD3063A1A8A0",
            "0xB248a295732e0225acd3337607cc01068e3b9c10",
            "0x151B1e2635A717bcDc836ECd6FbB62B674FE3E1D",
        ]
    ),
    new Protocol(
        "Benqui Lending",
        "43114",
        [
            "0x5C0401e81Bc07Ca70fAD469b451682c0d747Ef1c",
            "0xF362feA9659cf036792c9cb02f8ff8198E21B4cB",
            "0x89a415b3D20098E6A6C8f7a59001C67BD3129821",
            "0xe194c4c5aC32a3C9ffDb358d9Bfd523a0B6d1568",
            "0x334AD834Cd4481BB02d09615E7c11a00579A7909",
            "0x4e9f683A27a6BdAD3FC2764003759277e93696e6",
            "0xc9e5999b8e75C3fEB117F6f73E664b9f3C8ca65C",
            "0xBEb5d47A3f720Ec0a390d04b4d41ED7d9688bC7F",
            "0xd8fcDa6ec4Bdc547C0827B8804e89aCd817d56EF",
            "0xB715808a78F6041E46d61Cb123C9B4A27056AE9C",
            "0x835866d37AFB8CB8F8334dCCdaf66cf01832Ff5D",
            "0x872670CcAe8C19557cC9443Eff587D7086b8043A",
            "0x35Bd6aedA81a7E5FC7A7832490e71F757b0cD9Ce",
        ]
    )

]

// mapping for ctoken address -> protocol name & chain
const protocolMap = new Map<string, { name: string; chain: string }>();

// generate the mapping
for (const protocol of protocols) {
    for (const ctokenAddress of protocol.ctokenAddresses) {
        protocolMap.set(ctokenAddress, { name: protocol.name, chain: protocol.chain });
    }
}
