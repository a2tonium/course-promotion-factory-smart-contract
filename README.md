# 📚 Decentralized Education Platform on TON Blockchain

## 📖 Overview  
This platform enables **educators** to create courses as **NFT Collections** and issue **NFT Certificates** to students upon course completion.  
All data is stored on **TON Blockchain** and **IPFS (Pinata)** to ensure **transparency, security, and decentralization**.  

---

## 🎭 **Roles in the System**
### 👨‍🏫 Educator  
- Creates courses (NFT Collections).  
- Manages course materials.  
- Grades quizzes submitted by students.  
- Issues NFT Certificates upon course completion.  

### 🎓 Student  
- Enrolls in courses by paying a **TON fee**.  
- Accesses course materials **after enrollment approval**.  
- Completes quizzes and submits answers via **encrypted transactions**.  
- Requests an NFT Certificate after finishing the course.  

---

## 📄 **Frontend Pages & Behavior**
### (1) **Course Creation Page**  
Educators create courses as **NFT Collections**.  
#### 📌 **Steps:**
1. Fill in course details (metadata).  
2. Upload course **thumbnail & materials** to **IPFS (Pinata)**.  
3. Deploy an **NFT Collection smart contract** with the metadata.  
4. Register the course **in the Global Registry** (small TON fee required).  

#### 🔗 **Example NFT Collection Metadata (Stored on IPFS)**
```json
{
    "name": "Blockchain Development Course",
    "description": "Master blockchain technology and receive an NFT certificate upon completion.",
    "image": "https://example.com/course-thumbnail.png",
    "video": "https://example.com/course-intro.mp4",
    "attributes": {
        "category": "IT/etc.",
        "duration": "12 weeks",
        "level": "Beginner to Advanced",
        "lessons": 30
    },
    "modules": [
            {
                "title": "Module Name",
                "lessons": [
                    {
                        "title": "Introduction to Blockchain",
                        "video": "https://example.com/module1.mp4",
                    },
                    {
                        "title": "Introduction to Blockchain",
                        "video": "https://example.com/module1.mp4",
                    },
                ],
                "quiz": {
                        "title": "Blockchain Basics Quiz",
                        "questions": [
                            {
                                "question": "What is a blockchain?",
                                "answers": ["A centralized database", "A distributed ledger technology", "A type of cryptocurrency", "A cloud storage service"]
                            }
                        ],
                        "correct_answers": "encrypted_by_educator_public_key"
                    }
            },
        ],
     "social_links": [
        "https://t.me/BlockchainCourse", "https://linkedin/in/ansinitro"
    ]
}
```

---

### (2) **Course Enrollment Page**  
Students enroll in a course by sending a **TON transaction** with **personal data (encrypted)**.

#### 📌 **Steps:**
1. Student sends **TON Coins** to the **NFT Collection smart contract**.  
2. The contract emits a transaction for tracking purposes.  
3. Educator receives an **enrollment request** and manually **grants access** to private course materials (e.g., YouTube private videos).  

#### 📤 **Transaction Message Example (Sent by Student)**
```json
{
    "email": "student@gmail.com",
    "iin": "050201038281"
}
```
✅ **Storage Optimization:**  
- Instead of storing enrollment data **on-chain** (which is costly 💰), it is stored as **emitted events**.  
- The backend will **scan blockchain transactions** and **cache enrollments** for fast access.  

✅ **Example Emit Message for Backend Tracking:**
```fift
emit ("enrolled", { student_wallet: <student_address>, course_id: <NFT_Collection_Address> });
```

---

### (3) **Quiz Submission Page**  
Students **submit quiz answers via encrypted transactions**.  
#### 📌 **Steps:**
1. The student encrypts answers with the **educator’s public key**.  
2. The encrypted data is sent as a **TON transaction message**.  
3. The **educator’s backend** decrypts the answers and **grades the student**.  

✅ **Security Consideration:**  
- If an **educator's private key is compromised**, the educator **must publicly announce it** to **invalidate past certificates**.

---

### (4) **NFT Certificate Issuance**  
Students request an **NFT Certificate** after passing all quizzes.  

#### 📌 **Steps:**
1. The student sends a **TON transaction** with the message `"Request NFT Certificate"`.  
2. The backend verifies if:  
   - The student has **enrolled**.  
   - The student has **passed all quizzes**.  
   - The **educator approves the certificate issuance**.  
3. The **NFT Certificate (NFT Item)** is minted.  

✅ **Certificate Minting Fee** is pre-paid by the **educator** (included in the course price).  

#### 🏆 **Example NFT Certificate Metadata**
```json
{
    "name": "Blockchain Development Course Certificate",
    "description": "Awarded upon completion of the course.",
    "image": "https://example.com/certificate.png",
    "content_url": "https://example.com/certificates/blockchain_course_certificate.pdf",
    "attributes": [
        {"trait_type": "Average Grade", "value": "92%"},
        {"trait_type": "Completion Date", "value": "2025-02-22"},
        {"trait_type": "Instructor", "value": "Dr. Jane Doe"},
        {"trait_type": "Student_IIN", "value": "050204814823"},
        {"trait_type": "email", "value": "student@gmail.com"}
    ],
    "quiz_grades": ["100%", "100%", "100%", "70%", "90%"]
}
```

✅ **Verification Process:**  
- Each certificate has a **QR code** linking to the blockchain explorer for **employer verification**.  
- NFTs couldn't be transferred, that's why they're always **verified**.

---

## ⚙️ **System Architecture**
### **Educator Backend (Go-based)**
- Listens for **student transactions** (enrollments, quiz submissions, certificate requests).  
- Processes **quiz answers** and calculates **grades**.  
- Approves **certificate issuance** by interacting with the NFT Collection contract.  

✅ **No External Database Needed**  
- The backend fetches all **data directly from the blockchain**.  
- Uses **TON HTTP API** (GetBlock) or **Anton Indexer** to retrieve transaction history.

---

## 🚀 **Advantages of This System**
✅ **No Intermediaries** – Payments go directly to educators.  
✅ **Immutable Proof** – Certificates cannot be faked or altered.  
✅ **Transparent & Public** – All transactions are on TON Blockchain.  
✅ **Cost-Efficient** – Smart contract storage is minimized.  
✅ **Easy Verification** – Employers can verify certificates instantly.  
✅ **Scalable** – New educators and students can join permissionlessly.  
✅ **Highly Secure** – The backend does not communicate with the public internet or rely on external databases, making it resistant to hacking. It only listens to TON Blockchain transactions, ensuring trustless execution without vulnerabilities to traditional cyberattacks.

---

## **Next Steps**
💡 The **next milestone** is to implement the **smart contracts** and deploy the **frontend interface**.  
- **Frontend:** React + TON Web3 SDK  
- **Backend:** Go + TON API (GetBlock) / Anton Indexer

### 🏗 **Future Enhancements**
🚀 **Steganography in Certificates** – Embed signed messages inside certificate images.  
🚀 **AI-based Auto-Grading** – Use machine learning to assist educators in grading.  
🚀 **Web3 Reputation System** – Build **on-chain credibility** for educators.  
