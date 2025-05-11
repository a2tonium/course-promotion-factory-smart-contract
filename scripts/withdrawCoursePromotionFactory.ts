import { toNano, Address } from '@ton/core';
import { CoursePromotionFactory } from '../wrappers/CoursePromotionFactory';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const STUDENT_ADDRESS = "0QC4hAk6Xhs4UY3dPZ3o0UbR5dnV4EeO-6I0dp13fYcsjAxo"; // 🔴 change this 

    const coursePromotionFactory = provider.open(await CoursePromotionFactory.fromInit(Address.parse(STUDENT_ADDRESS)));
    
    await coursePromotionFactory.send(
        provider.sender(),
        {
            value: toNano('0.01'),
        },
        "Withdraw",
    );
}
