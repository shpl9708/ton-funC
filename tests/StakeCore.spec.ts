import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, Cell, openContract, toNano } from '@ton/core';
import { StakeCore } from '../wrappers/StakeCore';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('StakeCore', () => {
    let factory_code: Cell;
    let farm_code:Cell;
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let factory: SandboxContract<StakeCore>;
    //let farm: SandboxContract<Farm>;
    beforeAll(async () => {
        factory_code    = await compile('StakeCore');
        farm_code       = await compile('Farm');
        blockchain      = await Blockchain.create();
        deployer        = await blockchain.treasury('deployer');
        factory         = blockchain.openContract(
            StakeCore.createFromConfig({
                deployer: deployer.address,
                farm_code: farm_code
            }, factory_code));
        

        
        

    });

    

    beforeEach(async () => {
        
    })

         it('should deploy', async()=>{
            const result = await factory.sendDeploy(deployer.getSender(), toNano(10));
            //console.log(result.transactions)
            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: factory.address,
                deploy: true,
            });

            const pool_res = await factory.sendCreateNewPool(deployer.getSender())
           
            const address = (pool_res!.events!.find(v=>v!.type == 'account_created')!.account)
            const addr = await factory.getFarmData(deployer.getSender(), factory.address)

            expect(addr.equals(address)).toEqual(true)
            
            const farm = await blockchain.getContract(address);
            const {stack} = await farm.get("get_duration", []);
            console.log(stack)
        

    //     const deployResult = await counter.sendDeploy(deployer.getSender(), toNano('0.05'));
    //     expect(deployResult.transactions).toHaveTransaction({
    //         from: deployer.address,
    //         to: counter.address,
    //         deploy: true,
    //         success: true,
    //     });
     });
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
