import { toNano, Address, beginCell } from '@ton/core';
import { CoursePromotionFactory } from '../wrappers/CoursePromotionFactory';
import { NetworkProvider } from '@ton/blueprint';
import { encodeOffChainContent } from "./utils/utils"

export async function run(provider: NetworkProvider) {
    const STUDENT_ADDRESS = "0QC4hAk6Xhs4UY3dPZ3o0UbR5dnV4EeO-6I0dp13fYcsjAxo"; // 🔴 change this 
    const PROFILE_CONTENT = encodeOffChainContent("ipfs://bafkreiagbirf6vxelu7rewv5vhf4gtrebmykpqnljniqqysmg4xkprvrhm");
    const coursePromotionFactory = provider.open(await CoursePromotionFactory.fromInit(Address.parse(STUDENT_ADDRESS)));
    
    await coursePromotionFactory.send(
        provider.sender(),
        {
            value: toNano('3'),
        },
        {
            $$type: 'Promote',
            course_address: beginCell().storeAddress(coursePromotionFactory.address).endCell(),
        }
    );
}
