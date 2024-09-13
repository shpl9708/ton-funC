import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Counter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Counter');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counter = blockchain.openContract(Counter.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

    //     deployer.send({
    //         value: BigInt(0),
    // to: Address.parse('0QCvAUFY7omwzSkrTjOHyYTC-_2Bw5YicTN-u2t3Svbhjw3I'),
    // bounce: false,
    // body: beginCell()
    // .storeUint(0x7362d09c, 32) // transfer noti
    // .storeUint(0, 64) // queryId
    // .storeCoins(BigInt(1000))
    // .storeAddress(Address.parse('0QCvAUFY7omwzSkrTjOHyYTC-_2Bw5YicTN-u2t3Svbhjw3I'))
    // .storeAddress(deployer.address)
    // .storeUint()
    // .endCell() 
         })

    //     const deployResult = await counter.sendDeploy(deployer.getSender(), toNano('0.05'));
    //     expect(deployResult.transactions).toHaveTransaction({
    //         from: deployer.address,
    //         to: counter.address,
    //         deploy: true,
    //         success: true,
    //     });
    // });
    // it('should deploy', async () => {
    //     // the check is done inside beforeEach
    //     // blockchain and counter are ready to use
    //     const aa = await counter.getCount();
    //     console.log(aa)
        

    // });
    // it('SHould send', async()=>{

    //     const bb = await counter.sendData(deployer.getSender())
    //     // console.log(bb.result)
    //     // console.log(bb.transactions)
    //     await counter.getFromDict(deployer.address)
    //     expect(bb.transactions).toHaveTransaction({
    //         success: true,
    //     });
    //     const aa = await counter.sendRemoveData(deployer.getSender())
    //     await counter.getFromDict(deployer.address)
    //     //console.log(bb);

    // })
});
