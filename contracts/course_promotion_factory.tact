// ============================
// A2Tonium Smart Contract
// ============================
// 🚀 A2Tonium - Unifying learners, educators, and knowledge across the digital world.
//
// 🔗 GitHub: https://github.com/a2tonium/
//
// Join the revolution and contribute to the future of digital learning! 🌍
// ============================
import "./promoted_course.tact";
import "./message";

contract CoursePromotionFactory {
    override const storageReserve: Int = minTonsForStorage;

    next_item_index: Int as uint32 = 0;
    collection_content: Cell;   
    owner: Address;
    cost: Int as coins = ton("10000");

    init(owner: Address){
        throwUnless(132, sender() == owner);
        self.owner = owner;
        self.collection_content = emptyCell();
    }

    receive(msg: UpdateCoursePromotionFactory) {
        throwUnless(132, sender() == self.owner);
        require(msg.cost > minTonsForStorage + gasConsumption, "Minimum cost is 0.04");
        require(msg.content != emptyCell(), "Content must not be empty");
        self.collection_content = msg.content;
        self.cost = msg.cost;

        self.notify("Course Promotion Factory updated successfully".asComment());
    }

    receive("Withdraw") {
        throwUnless(132, sender() == self.owner);
        nativeReserve(minTonsForStorage + gasConsumption, ReserveExact);
        send(SendParameters{
                to: self.owner,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: "Withdrawal completed successfully".asComment()
        });
    }

    receive(msg: Promote) {
        let ctx: Context = context();
        require(ctx.value >= self.cost, "Insufficient funds");
        let nft_init: StateInit = self.getPromotedCourseInit(self.next_item_index);

        send(SendParameters{
                to: contractAddress(nft_init), 
                value: minTonsForStorage, 
                bounce: false,
                mode: SendPayGasSeparately | SendIgnoreErrors,
                body: Transfer {
                    query_id: 0,
                    new_owner: sender(),
                    custom_payload: msg.course_address,
                }.toCell(),
                code: nft_init.code,
                data: nft_init.data
            });
        self.next_item_index += 1;

        send(SendParameters{
            value: ctx.value - self.cost,
            mode: SendPayGasSeparately,
            to: ctx.sender,
            bounce: false,
            body: "Course promoted successfully!".asComment()
        });
    }

    // ===== Private Methods ===== //
    fun getPromotedCourseInit(item_index: Int): StateInit {
        return initOf PromotedCourse(myAddress(), item_index);
    }


    // ------------------ Get Function  ------------------ //
    get fun get_collection_data(): CollectionData {     
        return CollectionData{
            next_item_index: self.next_item_index, 
            collection_content: self.collection_content, 
            owner_address: self.owner
        };
    }

    get fun get_course_promotion_factory_data(): CoursePromotionFactoryData {     
        return CoursePromotionFactoryData{
            next_item_index: self.next_item_index, 
            collection_content: self.collection_content, 
            owner_address: self.owner,
            cost: self.cost
        };
    }

    get fun get_nft_address_by_index(item_index: Int): Address?{      
        let initCode: StateInit = self.getPromotedCourseInit(item_index);
        return contractAddress(initCode);
    }
    
    get fun get_nft_content(index: Int, individual_content: Cell): Cell { 
        return individual_content;
    }
}
