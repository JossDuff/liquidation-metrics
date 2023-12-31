// This allows me to go from ctoken address -> protocol name/chain

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
        "Benqi Lending",
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
    ),
    new Protocol(
        "Flux Finance",
        "1",
        [
            "0x465a5a630482f3abD6d3b84B39B29b07214d19e5",
            "0xe2bA8693cE7474900A045757fe0efCa900F6530b",
            "0x81994b9607e06ab3d5cF3AffF9a67374f05F27d7",
            "0x1C9A2d6b33B4826757273D47ebEe0e2DddcD978B",
            "0x1dD7950c266fB1be96180a8FDb0591F70200E018",
        ]
    ),
    new Protocol(
        "Iron Bank",
        "1",
        [
            "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
            "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
            "0x9e8E207083ffd5BDc3D99A1F32D1e6250869C1A9",
            "0xE7BFf2Da8A2f619c2586FB83938Fa56CE803aA16",
            "0xFa3472f7319477c9bFEcdD66E4B948569E7621b9",
            "0x12A9cC33A980DAa74E00cc2d1A0E74C57A93d12C",
            "0x8Fc8BFD80d6A9F17Fb98A373023d72531792B431",
            "0x48759F220ED983dB51fA7A8C0D2AAb8f3ce4166a",
            "0x76Eb2FE28b36B3ee97F3Adae0C69606eeDB2A37c",
            "0x226F3738238932BA0dB2319a8117D9555446102f",
            "0xecaB2C76f1A8359A06fAB5fA0CEea51280A97eCF",
            "0x00e5c0774A5F065c285068170b20393925C84BF3",
            "0xA8caeA564811af0e92b1E044f3eDd18Fa9a73E4F",
            "0x30190a3B52b5AB1daF70D46D72536F5171f22340",
            "0x7736Ffb07104c0C400Bb0CC9A7C228452A732992",
            "0x86BBD9ac8B9B44C95FFc6BAAe58E25033B7548AA",
            "0xB8c5af54bbDCc61453144CF472A9276aE36109F9",
            "0x215F34af6557A6598DbdA9aa11cc556F5AE264B1",
            "0x3c9f5385c288cE438Ed55620938A4B967c080101",
            "0xE0B57FEEd45e7D908f2d0DaCd26F113Cf26715BF",
            "0xa7c4054AFD3DbBbF5bFe80f41862b89ea05c9806",
            "0x1b3E95E8ECF7A7caB6c4De1b344F94865aBD12d5",
            "0xFEEB92386A055E2eF7C2B598c872a4047a7dB59F",
            "0xbC6B6c837560D1fE317eBb54E105C89f303d5AFd",
        ]
    ),
    new Protocol(
        "Iron Bank",
        "43114",
        [
            "0xb3c68d69E95B095ab4b33B4cB67dBc0fbF3Edf56",
            "0x338EEE1F7B89CE6272f302bDC4b952C13b221f1d",
            "0xCEb1cE674f38398432d20bc8f90345E91Ef46fd3",
            "0xe28965073C49a02923882B8329D3E8C1D805E832",
            "0x085682716f61a72bf8C573FBaF88CCA68c60E99B",
            "0xB09b75916C5F4097C8b5812E63e216FEF97661Fc",
            "0x18931772Adb90e7f214B6CbC78DdD6E0F090D4B1",
            "0xEc5Aa19566Aa442C8C50f3C6734b6Bb23fF21CD7",
            "0xbf1430d9eC170b7E97223C7F321782471C587b29",
            "0x02C9133627a14214879175a7A222d0a7f7404eFb",
            "0x3Af7c11d112C1C730E5ceE339Ca5B48F9309aCbC",
        ]
    ),
    new Protocol(
        "Iron Bank",
        "10",
        [
            "0x17533a1bDe957979E3977EbbFBC31E6deeb25C7d",
            "0x1d073cf59Ae0C169cbc58B6fdD518822ae89173a",
            "0x874C01c2d1767EFA01Fa54b2Ac16be96fAd5a742",
            "0x049E04bEE77cFfB055f733A138a2F204D3750283",
            "0xcdb9b4db65C913aB000b40204248C8A53185D14D",
            "0x4645e0952678E9566FB529D9313f5730E4e1C412",
            "0xE724FfA5D30782499086682C8362CB3673bF69ae",
            "0x04F0fd3CD03B17a3E5921c0170ca6dD3952841cA",
        ]
    ),
    new Protocol(
        "Strike Finance",
        "1",
        [
            "0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92",
            "0x69702cfd7DAd8bCcAA24D6B440159404AAA140F5",
            "0x3774E825d567125988Fb293e926064B6FAa71DAB",
            "0x18A908eD663823C908A900b934D6249d4befbE44",
            "0x3F3B3B269d9f7088B022290906acff8710914be1",
            "0x280f76a218DDC8d56B490B5835e251E55a2e8F8d",
            "0x9d1C2A187cf908aEd8CFAe2353Ef72F06223d54D",
            "0xA28d2EC98C6bb076A2e152dC9e0d94C8C01e36B0",
            "0xb7E11002228D599F2a64b0C44D2299C9c644ff26",
            "0xdBee1d8C452c781C17Ea20115CbaD0d5f627a680",
            "0x4164e5b047842Ad7dFf18fc6A6e63a1e40610f46",
            "0xa9bA206cfb0548bF93eF1040dDDD5121da9eaf85",
            "0xf24A7D2077285E192Aa7dF957a4a699c144510d8",
            "0x54A0ed40abEa082ed62C3a4f92621b8ed47732a2",
            "0xC13FDF3aF7ec87dcA256d9C11Ff96405D360F522",
            "0x1EBfD36223079dC79FefC62260dB9E25f3F5e2C7",
        ]
    )
]

let protocolMap = new Map<string, { name: string; chain: string }>();

// generate the mapping
for (const protocol of protocols) {
    for (const ctokenAddress of protocol.ctokenAddresses) {
        protocolMap.set(ctokenAddress, { name: protocol.name, chain: protocol.chain });
    }
}

export { protocolMap };
