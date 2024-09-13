import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Slice } from '@ton/core';

export type CounterConfig = {
    deployer: Address,
    farm_code: Cell
};

export function counterConfigToCell(config: CounterConfig): Cell {
    return beginCell()
            .storeUint(0, 64)
            .storeAddress(config.deployer)
            .storeRef(config.farm_code)
            .endCell();
}

export class StakeCore implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new StakeCore(address);
    }

    static createFromConfig(config: CounterConfig, code: Cell, workchain = 0) {
        const data = counterConfigToCell(config);
        const init = { code, data };
        return new StakeCore(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendCreateNewPool(provider: ContractProvider, via: Sender){
        const body = beginCell()
                        .storeUint(0x2002fcd9, 32)
                        .storeUint(BigInt(0), 64)
                        .storeUint(BigInt(0), 32)
                        .storeCoins(BigInt(100000))
                        .storeCoins(BigInt(100000))
                        .storeAddress(via.address)
                        .storeAddress(via.address)
                        .endCell();
                    await provider.internal(via, {
                        value: "100",
                        body
                    })
                        
    }
    async getFarmData(provider: ContractProvider, via: Sender, contractAddress: Address): Promise<any> {
        const token_info = beginCell()
                            .storeAddress(via.address)
                            .storeAddress(via.address)
                            .storeCoins(BigInt(100000))
                            .endCell();
        const body = beginCell()
            .storeUint(BigInt(0), 64)
            .storeAddress(contractAddress)
            .storeAddress(via.address)
            .storeUint(BigInt(0), 32)
            .storeUint(BigInt(0), 32)
            .storeRef(token_info)
        .endCell();

        const {stack} = await provider.get('get_farm_address', [{type:'cell', cell: body}]);
        return stack.readAddress();
    }
}
