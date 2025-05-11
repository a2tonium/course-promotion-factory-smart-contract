// ============================
// A2Tonium Smart Contract
// ============================
// 🚀 A2Tonium - Unifying learners, educators, and knowledge across the digital world.
//
// 🔗 GitHub: https://github.com/a2tonium/
//
// Join the revolution and contribute to the future of digital learning! 🌍
// ============================
struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}
message(0x5fcc3d14) Transfer {
    query_id: Int as uint64;
    new_owner: Address?;
    response_destination: Address?;
    custom_payload: Cell;
    forward_amount: Int? as coins;
    forward_payload: Cell?;
}
message(0xd53276db) Excesses {
    query_id: Int as uint64;
}
message(0x2fcb26a2) GetStaticData {
    query_id: Int as uint64;
}
message(0x8b771735) ReportStaticData {
    query_id: Int as uint64;
    index_id: Int;
    collection: Address;
}
struct GetNftData {
    is_initialized: Bool;
    index: Int;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
}

message(0xe84dd49a) UpdateCoursePromotionFactory {
    content: Cell;
    cost: Int as coins;
}
message(0x1821f3b6) Promote {
    course_address: Cell;
}
struct CoursePromotionFactoryData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
    cost: Int as coins;
}