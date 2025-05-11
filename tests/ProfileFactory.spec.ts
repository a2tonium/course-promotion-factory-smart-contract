import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, toNano } from '@ton/core';
import { CoursePromotionFactory } from '../wrappers/CoursePromotionFactory';
import { PromotedCourse } from '../wrappers/PromotedCourse';
import '@ton/test-utils';

const PROFILE_FACTORY_DATA = {
    content: beginCell().storeStringTail("fdjhskaf").endCell(),
    cost: toNano('5')
};
const PROFILE_DATA = {
    course_address: beginCell().storeStringTail("ipfs://sadjfksajd").endCell()
}
const TON_COINS = {
    initialCoursePromotionFactoryCost: toNano("10000"),
    minTonsForStorage: toNano("0.02"),
    gasConsumption: toNano("0.03"),
    tollerance: toNano("0.01")
}

describe('CoursePromotionFactory Creation', () => {
    let blockchain: Blockchain;
    let educator: SandboxContract<TreasuryContract>;
    let promotedFactory: SandboxContract<CoursePromotionFactory>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        educator = await blockchain.treasury('educator');
    });

    it('create promotedFactory', async () => {
        promotedFactory = blockchain.openContract(await CoursePromotionFactory.fromInit(educator.address));
        const deployResult = await promotedFactory.send(
            educator.getSender(),
            { value: TON_COINS.minTonsForStorage + TON_COINS.gasConsumption },
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: PROFILE_FACTORY_DATA.cost,
            }
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: educator.address,
            to: promotedFactory.address,
            deploy: true,
            success: true
        });
        expect((await promotedFactory.getGetCoursePromotionFactoryData()).owner_address.toString()).toEqual(educator.address.toString());
    });

    it('deploy promotedFactory for ansi', async () => {
        const ansiAddress = Address.parse('0QC4hAk6Xhs4UY3dPZ3o0UbR5dnV4EeO-6I0dp13fYcsjAxo');
        promotedFactory = blockchain.openContract(await CoursePromotionFactory.fromInit(ansiAddress));
        const educatorBalanceBefore = await educator.getBalance();
        const deployResult = await promotedFactory.send(
            educator.getSender(),
            { value: TON_COINS.minTonsForStorage + TON_COINS.gasConsumption },
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: PROFILE_FACTORY_DATA.cost,
            }
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: educator.address,
            to: promotedFactory.address,
            deploy: true,
            success: false
        });
        try {
            await promotedFactory.getGetCoursePromotionFactoryData();
        } catch (error) {
            expect(error).toBeDefined();
        }
        expect((await educator.getBalance())).
            toBeGreaterThan(educatorBalanceBefore - TON_COINS.gasConsumption);
    });

    it('create promotedFactory with `ton less` than `minimal ton for storage`', async () => {
        const value = toNano('0.01');
        expect(value).toBeLessThan(TON_COINS.minTonsForStorage);
        const promotedFactoryWithId1 = blockchain.openContract(await CoursePromotionFactory.fromInit(educator.address));
        const deployResult = await promotedFactoryWithId1.send(
            educator.getSender(),
            {
                value: value,
            },
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: PROFILE_FACTORY_DATA.cost,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: educator.address,
            to: promotedFactoryWithId1.address,
            deploy: true,
            success: false,
        });
    });

    it('create promotedFactory and send a lot of ton (ton should returned)', async () => {
        promotedFactory = blockchain.openContract(await CoursePromotionFactory.fromInit(educator.address));
        const educatorBalanceBefore = await educator.getBalance();
        const deployResult = await promotedFactory.send(
            educator.getSender(),
            { value: toNano("50000") }, // 50 000 TON
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: PROFILE_FACTORY_DATA.cost,
            }
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: educator.address,
            to: promotedFactory.address,
            deploy: true,
            success: true,
        });

        expect((await blockchain.getContract(promotedFactory.address)).balance).toEqual(TON_COINS.minTonsForStorage);
        expect((await educator.getBalance())).
            toBeGreaterThan(educatorBalanceBefore - TON_COINS.gasConsumption - TON_COINS.minTonsForStorage);
    })
});

describe('CoursePromotionFactory general', () => {
    let blockchain: Blockchain;
    let educator: SandboxContract<TreasuryContract>;
    let promotedFactory: SandboxContract<CoursePromotionFactory>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        educator = await blockchain.treasury('educator');
        promotedFactory = blockchain.openContract(await CoursePromotionFactory.fromInit(educator.address));

        await promotedFactory.send(
            educator.getSender(),
            {
                value: TON_COINS.minTonsForStorage + TON_COINS.gasConsumption,
            },
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: PROFILE_FACTORY_DATA.cost,
            }
        );
    });

    it('check all init data', async () => {
        const initNextItemIndex = 0n;
        const promotedFactoryData = await promotedFactory.getGetCoursePromotionFactoryData();

        expect(promotedFactoryData.next_item_index).toEqual(initNextItemIndex);
        expect(promotedFactoryData.collection_content.toString()).toEqual(PROFILE_FACTORY_DATA.content.toString());
        expect(promotedFactoryData.owner_address.toString())
            .toEqual(educator.address.toString());
        expect(promotedFactoryData.cost).toEqual(PROFILE_FACTORY_DATA.cost);
    });
});

describe('CoursePromotionFactory UpdateCoursePromotionFactory', () => {
    let blockchain: Blockchain;
    let educator: SandboxContract<TreasuryContract>;
    let promotedFactory: SandboxContract<CoursePromotionFactory>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        educator = await blockchain.treasury('educator');
        promotedFactory = blockchain.openContract(await CoursePromotionFactory.fromInit(educator.address));

        await promotedFactory.send(
            educator.getSender(),
            {
                value: TON_COINS.minTonsForStorage + TON_COINS.gasConsumption,
            },
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: PROFILE_FACTORY_DATA.cost,
            }
        );
    });

    it('owner set cost', async () => {
        const educatorBalanceBefore = await educator.getBalance();
        const newCost = toNano('100');
        const setCostResult = await promotedFactory.send(
            educator.getSender(),
            {
                value: toNano("500"),
            },
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: newCost,
            }
        );
        expect(setCostResult.transactions).toHaveTransaction({
            from: educator.address,
            to: promotedFactory.address,
            success: true,
        });
        expect((await promotedFactory.getGetCoursePromotionFactoryData()).cost).toEqual(newCost);
        expect(await educator.getBalance()).toBeGreaterThan(educatorBalanceBefore - TON_COINS.gasConsumption);
    });

    it('not owner set cost', async () => {
        const notOwner = await blockchain.treasury('notowner');
        const notOwnerSetCost = toNano("1");
        const setCostResult = await promotedFactory.send(
            notOwner.getSender(),
            {
                value: toNano("0.01"),
            },
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: notOwnerSetCost,
            }
        );

        expect(setCostResult.transactions).toHaveTransaction({
            from: notOwner.address,
            to: promotedFactory.address,
            success: false,
        });
        expect((await promotedFactory.getGetCoursePromotionFactoryData()).cost).toEqual(PROFILE_FACTORY_DATA.cost);
    });

    it('owner set cost less 0', async () => {
        // we can't check it because the `cost` is `Int as coins` and we make the  
        //         {
        //             $$type:'UpdateCoursePromotionFactory', 
        //             content: PROFILE_FACTORY_DATA.content,
        //             cost: toNano('-1'),
        //         }
        // the cost can't be equal to negative 
    });
});

describe('CoursePromotionFactory Withdraw', () => {
    let blockchain: Blockchain;
    let educator: SandboxContract<TreasuryContract>;
    let promotedFactory: SandboxContract<CoursePromotionFactory>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        educator = await blockchain.treasury('educator');
        promotedFactory = blockchain.openContract(await CoursePromotionFactory.fromInit(educator.address));

        await promotedFactory.send(
            educator.getSender(),
            {
                value: TON_COINS.minTonsForStorage + TON_COINS.gasConsumption,
            },
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: PROFILE_FACTORY_DATA.cost,
            }
        );
        // someone enrolled
        await promotedFactory.send(
            educator.getSender(),
            {
                value: TON_COINS.minTonsForStorage + toNano("256"),
            },
            {
                $$type: 'Promote',
                course_address: PROFILE_DATA.course_address,
            }
        );
    });

    it('owner withdraw', async () => {
        const educatorBalanceBefore = await educator.getBalance();
        const withdrawResult = await promotedFactory.send(
            educator.getSender(),
            { value: TON_COINS.gasConsumption },
            'Withdraw'
        );

        expect(withdrawResult.transactions).toHaveTransaction({
            from: educator.address,
            to: promotedFactory.address,
            success: true
        });
        // 0.04 = 0.02 + 0.02 = minTonsForStorage + gasConsumtion (in smart contract)
        expect((await blockchain.getContract(promotedFactory.address)).balance).toEqual(toNano('0.04'));
        expect(await educator.getBalance()).toBeGreaterThan(educatorBalanceBefore);
    });

    it('not owner withdraw', async () => {
        const notOwner = await blockchain.treasury('notowner');
        const notOwnerBalanceBefore = await notOwner.getBalance();
        const promotedFactoryBalanceBefore = await (await blockchain.getContract(promotedFactory.address)).balance;
        const withdrawResult = await promotedFactory.send(
            notOwner.getSender(),
            { value: TON_COINS.gasConsumption },
            'Withdraw'
        );

        expect(withdrawResult.transactions).toHaveTransaction({
            from: notOwner.address,
            to: promotedFactory.address,
            success: false
        });
        expect((await blockchain.getContract(promotedFactory.address)).balance).toEqual(promotedFactoryBalanceBefore);
        expect(await notOwner.getBalance()).toBeGreaterThan(notOwnerBalanceBefore - TON_COINS.gasConsumption);
    });
});

describe('CoursePromotionFactory Promote', () => {
    let blockchain: Blockchain;
    let educator: SandboxContract<TreasuryContract>;
    let student: SandboxContract<TreasuryContract>;
    let promotedFactory: SandboxContract<CoursePromotionFactory>;
    let promoted: SandboxContract<PromotedCourse>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        educator = await blockchain.treasury('educator');
        promotedFactory = blockchain.openContract(await CoursePromotionFactory.fromInit(educator.address));
        student = await blockchain.treasury('student');

        await promotedFactory.send(
            educator.getSender(),
            {
                value: TON_COINS.minTonsForStorage + TON_COINS.gasConsumption,
            },
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: PROFILE_FACTORY_DATA.cost,
            }
        );
    });

    it('promote course', async () => {
        const studentBalanceBefore = await student.getBalance();
        const promotedFactoryCost = (await promotedFactory.getGetCoursePromotionFactoryData()).cost;
        const enrollmentResult = await promotedFactory.send(
            student.getSender(),
            { value: promotedFactoryCost },
            {
                $$type: 'Promote',
                course_address: PROFILE_DATA.course_address,
            }
        );
        // 0.02 0.016164  0.003836  | when we use Cell in smart contract
        // 0.02 0.0155296 0.0044704 | when we use String in smart contract
        expect(enrollmentResult.transactions).toHaveTransaction({
            from: student.address,
            to: promotedFactory.address,
            success: true
        });
        expect((studentBalanceBefore - promotedFactoryCost) - await student.getBalance()).toBeLessThan(TON_COINS.tollerance);
        promoted = blockchain.openContract(await PromotedCourse.fromInit(promotedFactory.address, 0n))
        const promotedData = await promoted.getGetNftData();
        expect(promotedData.is_initialized).toEqual(true);
        expect(promotedData.collection_address.toString()).toEqual(promotedFactory.address.toString());
        expect(promotedData.owner_address.toString()).toEqual(student.address.toString());

        expect(promotedData.individual_content.asSlice().loadStringTail())
            .toEqual(PROFILE_DATA.course_address.asSlice().loadStringTail())
    });

    it('enroll with less coins than cost', async () => {
        const promotedFactoryBalanceBefore = (await blockchain.getContract(promotedFactory.address)).balance;
        const promotedFactoryCost = (await promotedFactory.getGetCoursePromotionFactoryData()).cost;
        const enrollmentResult = await promotedFactory.send(
            student.getSender(),
            { value: TON_COINS.gasConsumption },
            {
                $$type: 'Promote',
                course_address: beginCell().storeStringTail("050302013 | 4124@gmail.com").endCell(),
            }
        );

        expect(enrollmentResult.transactions).toHaveTransaction({
            from: student.address,
            to: promotedFactory.address,
            success: false
        });
        expect((await blockchain.getContract(promotedFactory.address)).balance).toEqual(promotedFactoryBalanceBefore);
    });

    it('enroll with a lot coins (should return)', async () => {
        const studentBalanceBefore = await student.getBalance();
        const promotedFactoryCost = (await promotedFactory.getGetCoursePromotionFactoryData()).cost;
        const enrollmentResult = await promotedFactory.send(
            student.getSender(),
            { value: TON_COINS.gasConsumption + promotedFactoryCost + toNano("83284") },
            {
                $$type: 'Promote',
                course_address: beginCell().storeStringTail("050302013 | 4124@gmail.com").endCell(),
            }
        );

        expect(enrollmentResult.transactions).toHaveTransaction({
            from: student.address,
            to: promotedFactory.address,
            success: true
        });
        expect((studentBalanceBefore - promotedFactoryCost) - await student.getBalance()).toBeLessThan(TON_COINS.tollerance);
    });
});

describe('PromotedCourse Transfer', () => {
    let blockchain: Blockchain;
    let educator: SandboxContract<TreasuryContract>;
    let student: SandboxContract<TreasuryContract>;
    let promotedFactory: SandboxContract<CoursePromotionFactory>;
    let promoted: SandboxContract<PromotedCourse>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        educator = await blockchain.treasury('educator');
        promotedFactory = blockchain.openContract(await CoursePromotionFactory.fromInit(educator.address));
        promoted = blockchain.openContract(await PromotedCourse.fromInit(promotedFactory.address, 0n));
        student = await blockchain.treasury('student');

        await promotedFactory.send(
            educator.getSender(),
            {
                value: TON_COINS.minTonsForStorage + TON_COINS.gasConsumption,
            },
            {
                $$type: 'UpdateCoursePromotionFactory',
                content: PROFILE_FACTORY_DATA.content,
                cost: PROFILE_FACTORY_DATA.cost,
            }
        );
        await promotedFactory.send(
            student.getSender(),
            { value: PROFILE_FACTORY_DATA.cost },
            {
                $$type: 'Promote',
                course_address: PROFILE_DATA.course_address,
            }
        );
    });

    it('update content of promoted', async () => {
        expect((await blockchain.getContract(promoted.address)).accountState?.type.toString())
        .toEqual('active');
        const promotedTransferResult = await promoted.send(
            student.getSender(),
            { value: TON_COINS.gasConsumption },
            {
                $$type: 'Transfer',
                query_id: 0n,
                new_owner: educator.address,
                response_destination: educator.address,
                custom_payload: beginCell().endCell(),
                forward_amount: 0n,
                forward_payload: beginCell().endCell(),
            }
        );

        expect(promotedTransferResult.transactions).toHaveTransaction({
            from: student.address,
            to: promoted.address,
            success: false,
        });
    });
});
