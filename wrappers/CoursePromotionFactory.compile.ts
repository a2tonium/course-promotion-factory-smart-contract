import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/course_promotion_factory.tact',
    options: {
        debug: true,
    },
};