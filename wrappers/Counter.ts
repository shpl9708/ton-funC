import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type CounterConfig = {};

export function counterConfigToCell(config: CounterConfig): Cell {
    return beginCell().storeUint(20, 64).storeDict().endCell();
}

export class Counter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Counter(address);
    }

    static createFromConfig(config: CounterConfig, code: Cell, workchain = 0) {
        const data = counterConfigToCell(config);
        const init = { code, data };
        return new Counter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getCount(provider: ContractProvider): Promise<any> {
        const {stack} = await provider.get('counter', []);
        return stack.readNumber();
    }
    async getFromDict(provider: ContractProvider, address: Address): Promise<any> {
        const {stack} = await provider.get('checkOwner', [{ type: 'slice', cell: beginCell().storeAddress(address).endCell() }]);
        console.log(stack)
        

    }

    async sendData(provider: ContractProvider, via: Sender): Promise<any> {
        const body = beginCell()
        .storeUint(1, 32)
        .storeUint(0, 64)
        .storeAddress(via.address)
        .endCell()
        console.log(via.address)
        await provider.internal(via, {
            value: "0.002",
            body
        })
    }
    async sendRemoveData(provider: ContractProvider, via: Sender): Promise<any> {
        const body = beginCell()
        .storeUint(2, 32)
        .storeUint(0, 64)
        .storeAddress(via.address)
        .endCell()
        console.log(via.address)
        await provider.internal(via, {
            value: "0.002",
            body
        })
    }

    


}
