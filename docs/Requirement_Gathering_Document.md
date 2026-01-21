# Requirement Gathering Document
## Project Title: Library Automation and Book Tracking System
**Version:** 1.0  
**Prepared By:** Group 3 – Field Project  
**Team Members:**
- Lalit Kumawat (Leader)
- Nikhil Kunder (Member)
- Pratiksha Lad (Member)
- Menka Rajak (Member)

**Date:** 15 January 2025

---

## Table of Contents
1. Introduction
2. Problem Statement
3. Stakeholder Identification
4. Requirement Gathering Approach
5. Interview Documentation
6. Survey Results
7. Observation Findings
8. Functional Requirements
9. Non-Functional Requirements
10. System Models and Diagrams
11. Prioritization of Requirements
12. Assumptions and Constraints
13. Requirement Validation
14. Conclusion
15. Appendices

---

## 1. Introduction

### 1.1 Purpose of Document
This Requirement Gathering Document provides a detailed overview of the requirements collected for the Library Automation and Book Tracking System. It includes information obtained through interviews, surveys, and observation of the current library management process. The document will guide the next phase: the Software Requirements Specification (SRS) and system design.

### 1.2 Project Description
The Library Automation and Book Tracking System aims to digitize and automate the complete library operations including book cataloging, member management, book issue/return processes, fine calculation, reservations, and comprehensive reporting. The system will serve students, faculty, librarians, and administrators through role-based access control.

### 1.3 Scope
The system will allow:
- **Members (Students/Faculty):** Search books, request book issues, view borrowed books, check due dates, pay fines, reserve books, receive notifications
- **Librarians:** Manage book inventory, process issue/return transactions, calculate fines, manage member records, handle reservations
- **Admins:** Complete system oversight, user management, generate reports, configure system settings, monitor library statistics

The system includes web-based interfaces for all user roles with real-time book tracking, automated notifications, fine management, and comprehensive analytics.

---

## 2. Problem Statement

Currently, the library management process faces several critical challenges:

**Manual Record Keeping:**
- Book records maintained in physical registers leading to data loss and errors
- Member information stored in paper files causing retrieval delays
- Transaction history difficult to track and audit

**Inefficient Book Search:**
- Students spend excessive time locating books on shelves
- No real-time availability information
- Difficulty in finding books by category, author, or subject

**Issue/Return Process Issues:**
- Long queues during peak hours
- Manual verification of member eligibility
- Prone to human errors in recording transactions
- No automated due date tracking

**Fine Management Problems:**
- Manual calculation of overdue fines
- Disputes over fine amounts
- No systematic fine collection tracking
- Difficulty in identifying defaulters

**Lack of Notifications:**
- No reminders for due dates
- Members unaware of book availability
- No alerts for overdue books

**Limited Reporting:**
- Difficulty in generating usage statistics
- No insights into popular books or categories
- Unable to track library performance metrics

**Book Reservation Issues:**
- No system to reserve currently issued books
- Unfair allocation when books become available

The proposed Library Automation and Book Tracking System will address these challenges through digitization, automation, and real-time tracking capabilities.

---

## 3. Stakeholder Identification

| Stakeholder | Role | Responsibilities | Expectations |
|-------------|------|------------------|--------------|
| **Students** | End Users (Members) | Borrow books, return books, pay fines | Easy book search, quick issue/return, fine transparency, mobile access |
| **Faculty Members** | End Users (Members) | Borrow books for teaching/research | Extended borrowing periods, priority access, reservation system |
| **Librarians** | System Operators | Process transactions, manage inventory, handle queries | Efficient workflow, automated calculations, easy book management |
| **Library Admin** | System Administrators | Oversee operations, manage users, generate reports | Complete control, comprehensive reports, system monitoring |
| **IT Department** | Technical Support | Maintain servers, ensure security, handle backups | Stable system, secure database, easy maintenance |
| **University Management** | Decision Makers | Monitor library usage, budget allocation | Usage analytics, cost-benefit reports, performance metrics |
| **Accounts Department** | Financial Tracking | Track fine collections, budget management | Accurate fine records, payment tracking, financial reports |

---

## 4. Requirement Gathering Approach

To ensure comprehensive and accurate requirements, the following techniques were employed:

### 4.1 Interviews
- **Conducted with:** 2 Librarians, 3 Faculty Members, 8 Students, 1 Library Admin, 1 IT Staff
- **Duration:** 20-30 minutes per interview
- **Method:** Semi-structured interviews with open-ended questions
- **Focus Areas:** Current process pain points, desired features, workflow requirements

### 4.2 Survey
- **Distribution:** Online survey via Google Forms
- **Participants:** 200 students, 25 faculty members, 5 library staff
- **Duration:** 1 week
- **Response Rate:** 87% (students), 92% (faculty), 100% (staff)
- **Question Types:** Multiple choice, rating scales, open-ended feedback

### 4.3 Observation
- **Location:** University Central Library
- **Duration:** 5 days (2 hours per day during peak hours)
- **Activities Observed:** Book issue process, return process, book search behavior, fine payment, member registration
- **Documentation:** Field notes, process flow diagrams, time measurements

### 4.4 Document Analysis
- **Documents Reviewed:**
  - Current book issue/return registers
  - Member registration forms
  - Fine calculation rules
  - Library policies and regulations
  - Existing book catalog system
  - Annual library reports

### 4.5 Competitive Analysis
- Reviewed 3 existing library management systems used by other universities
- Identified best practices and common features
- Noted gaps and improvement opportunities

---

## 5. Interview Documentation

### 5.1 List of Interviewees

**Library Staff:**
- Ms. Priya Sharma (Head Librarian) - 15 years experience
- Mr. Rajesh Kumar (Assistant Librarian) - 8 years experience

**Faculty Members:**
- Dr. Amit Verma (Computer Science Department)
- Prof. Sneha Desai (Electronics Department)
- Dr. Vikram Singh (Mechanical Engineering Department)

**Students:**
- 8 students from various departments (Engineering, Arts, Commerce)
- Mix of 2nd year to final year students

**Administration:**
- Mr. Suresh Patil (Library Administrator)
- Mr. Anil Joshi (IT Support Staff)

### 5.2 Interview Questions

**For Library Staff:**
1. What are the biggest challenges in the current manual system?
2. How much time does it take to process one book issue/return?
3. What information do you need to track for each book?
4. How do you currently calculate and collect fines?
5. What reports do you need to generate regularly?
6. What features would make your work more efficient?
7. How do you handle book reservations currently?
8. What security concerns do you have?

**For Students/Faculty:**
1. How often do you visit the library?
2. How do you currently search for books?
3. What difficulties do you face in borrowing books?
4. Have you ever faced issues with fines? What kind?
5. Would you prefer email or SMS notifications for due dates?
6. What features would you like in an online library system?
7. Do you use mobile devices more than computers?
8. How important is it to check book availability before visiting?

**For Administration:**
1. What metrics do you track for library performance?
2. What reports are needed for management decisions?
3. What are the security and privacy requirements?
4. What is the budget allocation for the system?
5. What are the integration requirements with existing university systems?

### 5.3 Summary of Interview Findings

**From Library Staff:**
- Average time per transaction: 5-7 minutes (too long during peak hours)
- Manual register maintenance takes 2 hours daily
- Fine calculation errors lead to disputes (reported 3-4 times weekly)
- Difficulty tracking overdue books - requires manual checking
- Need for automated reminders to reduce overdue cases
- Book inventory audit is time-consuming (done annually, takes 1 week)
- Want dashboard showing real-time statistics
- Need better member verification system
- Require bulk book addition feature
- Want to track book condition and damage history

**From Students:**
- 78% visit library at least once a week
- Major complaint: Cannot find books even when available (shelving issues)
- Want to know book availability before visiting library
- Prefer mobile-friendly interface
- Want to extend due dates online if no one is waiting
- Request email/SMS notifications for due dates
- Want to see their borrowing history
- Desire book recommendation feature based on interests
- Want to reserve books that are currently issued

**From Faculty:**
- Need longer borrowing periods than students (currently 7 days for all)
- Want to borrow more books simultaneously (current limit: 3 books)
- Request priority access for academic/research books
- Need system to recommend related books
- Want to track which books are used by their students
- Prefer email notifications over SMS

**From Administration:**
- Need comprehensive reports: monthly usage, popular books, member activity
- Want to track fine collection and outstanding amounts
- Require user activity logs for audit purposes
- Need system to be scalable for growing library collection
- Want integration with university ID card system
- Require data backup and recovery mechanisms
- Need role-based access with granular permissions

**From IT Department:**
- Prefer web-based system (no desktop installation)
- Want centralized database (MongoDB preferred)
- Need secure authentication (JWT tokens)
- Require encrypted password storage
- Want automated backup system
- Need system monitoring and error logging
- Prefer modular architecture for easy updates

---

## 6. Survey Results

### 6.1 Survey Summary
- **Total Respondents:** 230
  - Students: 200 (87% response rate)
  - Faculty: 25 (92% response rate)
  - Library Staff: 5 (100% response rate)

### 6.2 Key Findings

**Book Search and Availability:**
- 94% want online book search functionality
- 89% want real-time availability status
- 82% want advanced search filters (author, category, year, publisher)
- 76% want book recommendations based on borrowing history
- 71% want to see book location in library

**Issue/Return Process:**
- 91% prefer online book request system
- 85% want to see their current borrowed books online
- 88% want to view due dates and remaining days
- 79% want option to renew books online
- 67% want to see their complete borrowing history

**Notifications:**
- 93% want due date reminders
- 87% want overdue notifications
- 81% want notifications when reserved books become available
- 74% prefer email notifications
- 58% want SMS notifications (in addition to email)
- 45% want in-app notifications

**Fine Management:**
- 96% want transparent fine calculation
- 92% want to see fine details online
- 84% want online fine payment option
- 78% experienced disputes over fine amounts in current system
- 69% want fine payment history

**Reservation System:**
- 86% want to reserve currently issued books
- 79% want to see their position in reservation queue
- 72% want automatic notification when book is available
- 65% want to cancel reservations online

**User Interface Preferences:**
- 88% want mobile-responsive design
- 76% access internet primarily through smartphones
- 82% want simple and intuitive interface
- 68% want dark mode option
- 71% want to customize dashboard

**Additional Features:**
- 73% want book reviews and ratings
- 64% want to create reading lists/wishlists
- 59% want book recommendation system
- 54% want to see popular/trending books
- 48% want social features (share books with friends)

**System Access:**
- 95% want 24/7 system availability
- 89% want fast page loading (under 3 seconds)
- 84% want to access from any device
- 77% concerned about data privacy and security

### 6.3 Survey Charts and Statistics
*(To be included: Pie charts, bar graphs showing percentages for each category)*

---

## 7. Observation Findings

### 7.1 Current Process Observed

**Book Issue Process:**
1. Student arrives at library counter with physical ID card
2. Librarian manually verifies student details in register
3. Student requests specific book or asks for help finding it
4. Librarian checks availability in handwritten catalog
5. If available, student locates book on shelf (often takes 5-10 minutes)
6. Student returns to counter with book
7. Librarian records issue details in register (book ID, student ID, date, due date)
8. Librarian stamps due date on book card
9. Student receives book
**Average Time:** 12-15 minutes per transaction

**Book Return Process:**
1. Student brings book to counter
2. Librarian checks due date on book card
3. Librarian manually calculates fine if overdue
4. Student pays fine (if applicable) - cash only
5. Librarian records return in register
6. Librarian updates book availability in catalog
7. Book placed in re-shelving cart
**Average Time:** 5-8 minutes per transaction (longer if fine calculation needed)

**Book Search Process:**
1. Student checks card catalog (physical cards in drawers)
2. Student notes down book location code
3. Student navigates to shelf location
4. Student searches for book on shelf
5. Often book is not found (misshelved or already issued)
6. Student returns to ask librarian
**Average Time:** 15-20 minutes (often unsuccessful)

### 7.2 Issues Identified

**Efficiency Issues:**
- Long queues during peak hours (11 AM - 1 PM, 4 PM - 6 PM)
- Average wait time: 20-25 minutes during peak hours
- Librarian handles only 4-5 transactions per hour
- Manual data entry prone to errors (observed 2 errors in 10 transactions)

**Data Accuracy Issues:**
- Book availability status often incorrect
- Duplicate entries found in registers
- Missing transaction records
- Illegible handwriting causing confusion

**User Experience Issues:**
- Students frustrated with long search times
- No way to check availability before visiting
- Confusion about fine amounts
- No receipt provided for transactions
- No way to track personal borrowing history

**Operational Issues:**
- Register books running out of pages
- Difficulty finding old transaction records
- No backup of data
- Librarian spends 30% time on administrative tasks instead of helping users
- Book inventory count inaccurate

**Security Issues:**
- No verification of student identity beyond ID card
- Anyone can claim to be a student
- No tracking of who accessed what data
- Lost books difficult to track

**Communication Issues:**
- No way to remind students of due dates
- Students often forget return dates
- No way to inform students when reserved books arrive
- Announcements done through physical notice board only

### 7.3 Workflow Bottlenecks Identified
1. **Manual catalog checking** - Most time-consuming step
2. **Physical book location** - Students struggle to find books
3. **Fine calculation** - Causes delays and disputes
4. **Data entry** - Slows down transaction processing
5. **Member verification** - No quick validation method

### 7.4 Peak Usage Patterns
- **Busiest Days:** Monday, Wednesday (after new book arrivals)
- **Busiest Hours:** 11 AM - 1 PM, 4 PM - 6 PM
- **Average Daily Transactions:** 80-100 issues, 60-80 returns
- **Average Books in Circulation:** 450-500 books
- **Total Library Collection:** 15,000+ books



---

## 8. Functional Requirements

### 8.1 User Authentication & Authorization

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR1.1 | The system shall allow users to register with name, email, password, department, and phone number | Must Have |
| FR1.2 | The system shall allow users to log in using email and password | Must Have |
| FR1.3 | The system shall implement role-based access control (Member, Librarian, Admin) | Must Have |
| FR1.4 | The system shall automatically generate unique member IDs (MEM, LIB, ADM prefix) | Must Have |
| FR1.5 | The system shall allow users to reset forgotten passwords via email | Should Have |
| FR1.6 | The system shall allow users to log out securely | Must Have |
| FR1.7 | The system shall maintain user session for 24 hours or until logout | Should Have |
| FR1.8 | The system shall lock accounts after 5 failed login attempts | Should Have |

### 8.2 Member Module

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR2.1 | The system shall allow members to view and edit their profile information | Must Have |
| FR2.2 | The system shall allow members to upload profile pictures | Should Have |
| FR2.3 | The system shall allow members to search books by title, author, ISBN, category, or publisher | Must Have |
| FR2.4 | The system shall display real-time book availability status | Must Have |
| FR2.5 | The system shall allow members to request book issues | Must Have |
| FR2.6 | The system shall allow members to view their currently borrowed books | Must Have |
| FR2.7 | The system shall display issue date, due date, and remaining days for each borrowed book | Must Have |
| FR2.8 | The system shall allow members to view their complete borrowing history | Should Have |
| FR2.9 | The system shall allow members to view their fine details and payment history | Must Have |
| FR2.10 | The system shall allow members to reserve books that are currently issued | Should Have |
| FR2.11 | The system shall allow members to cancel their reservations | Should Have |
| FR2.12 | The system shall allow members to view their reservation queue position | Should Have |
| FR2.13 | The system shall allow members to renew books online (if no reservations pending) | Should Have |
| FR2.14 | The system shall allow members to create and manage wishlists | Could Have |
| FR2.15 | The system shall show book recommendations based on borrowing history | Could Have |
| FR2.16 | The system shall allow members to rate and review books | Could Have |

### 8.3 Librarian Module

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR3.1 | The system shall allow librarians to add new books with details (title, author, ISBN, category, publisher, year, copies, location) | Must Have |
| FR3.2 | The system shall allow librarians to edit existing book information | Must Have |
| FR3.3 | The system shall allow librarians to delete books from inventory | Must Have |
| FR3.4 | The system shall allow librarians to add multiple copies of the same book | Must Have |
| FR3.5 | The system shall allow librarians to search and filter books | Must Have |
| FR3.6 | The system shall allow librarians to process book issue requests | Must Have |
| FR3.7 | The system shall allow librarians to process book returns | Must Have |
| FR3.8 | The system shall automatically calculate fines for overdue books (₹10 per day) | Must Have |
| FR3.9 | The system shall allow librarians to record fine payments | Must Have |
| FR3.10 | The system shall allow librarians to view and manage member details | Must Have |
| FR3.11 | The system shall allow librarians to approve or reject book requests | Must Have |
| FR3.12 | The system shall allow librarians to view all active, overdue, and returned transactions | Must Have |
| FR3.13 | The system shall allow librarians to manage book reservations | Should Have |
| FR3.14 | The system shall allow librarians to generate circulation reports | Should Have |
| FR3.15 | The system shall allow librarians to search members by name, email, or member ID | Must Have |
| FR3.16 | The system shall allow librarians to mark books as damaged or lost | Should Have |
| FR3.17 | The system shall allow librarians to bulk upload books via CSV/Excel | Could Have |

### 8.4 Admin Module

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR4.1 | The system shall allow admins to perform all librarian functions | Must Have |
| FR4.2 | The system shall allow admins to create, edit, and delete user accounts | Must Have |
| FR4.3 | The system shall allow admins to assign and modify user roles | Must Have |
| FR4.4 | The system shall allow admins to activate or suspend user accounts | Must Have |
| FR4.5 | The system shall allow admins to view comprehensive dashboard with key statistics | Must Have |
| FR4.6 | The system shall allow admins to generate reports on issued books, returned books, overdue books, and fine collections | Must Have |
| FR4.7 | The system shall allow admins to view user activity logs | Should Have |
| FR4.8 | The system shall allow admins to configure system settings (fine rates, borrowing limits, due date periods) | Should Have |
| FR4.9 | The system shall allow admins to post notices and announcements | Should Have |
| FR4.10 | The system shall allow admins to view library usage analytics | Should Have |
| FR4.11 | The system shall allow admins to export reports in PDF/Excel format | Should Have |
| FR4.12 | The system shall allow admins to manage book categories | Should Have |
| FR4.13 | The system shall allow admins to view popular books and trending categories | Could Have |

### 8.5 Book Management System

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR5.1 | The system shall maintain complete book inventory with all details | Must Have |
| FR5.2 | The system shall track book status (Available, Issued, Reserved, Damaged, Lost) | Must Have |
| FR5.3 | The system shall prevent duplicate ISBN entries | Must Have |
| FR5.4 | The system shall automatically update available copies when books are issued or returned | Must Have |
| FR5.5 | The system shall track total copies, available copies, and issued copies for each book | Must Have |
| FR5.6 | The system shall store book location information for easy retrieval | Should Have |
| FR5.7 | The system shall maintain book addition history with timestamp and added by information | Should Have |
| FR5.8 | The system shall support multiple categories (Fiction, Non-Fiction, Science, Technology, History, Biography, Reference) | Must Have |
| FR5.9 | The system shall allow searching books with partial matches | Should Have |
| FR5.10 | The system shall display book cover images | Could Have |

### 8.6 Issue & Return Management

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR6.1 | The system shall allow book issue with automatic due date calculation (7 days default) | Must Have |
| FR6.2 | The system shall prevent issuing books when no copies are available | Must Have |
| FR6.3 | The system shall prevent members from issuing more than the allowed limit (3 books default) | Must Have |
| FR6.4 | The system shall record issue date, due date, and processing librarian for each transaction | Must Have |
| FR6.5 | The system shall allow book returns with automatic status update | Must Have |
| FR6.6 | The system shall automatically calculate and display fine amount during return | Must Have |
| FR6.7 | The system shall update book availability immediately after return | Must Have |
| FR6.8 | The system shall maintain complete transaction history for all books | Must Have |
| FR6.9 | The system shall automatically mark transactions as overdue when due date passes | Must Have |
| FR6.10 | The system shall allow book renewal if no reservations are pending | Should Have |
| FR6.11 | The system shall limit renewals to maximum 2 times per book | Should Have |
| FR6.12 | The system shall prevent issuing books to members with outstanding fines above ₹500 | Should Have |

### 8.7 Fine Management System

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR7.1 | The system shall automatically calculate fines at ₹10 per day for overdue books | Must Have |
| FR7.2 | The system shall display fine amount to members in their dashboard | Must Have |
| FR7.3 | The system shall maintain fine payment records with date and amount | Must Have |
| FR7.4 | The system shall show total outstanding fines for each member | Must Have |
| FR7.5 | The system shall allow partial fine payments | Should Have |
| FR7.6 | The system shall generate fine receipts | Should Have |
| FR7.7 | The system shall send fine reminders to members | Should Have |
| FR7.8 | The system shall allow admins to waive fines in special cases | Could Have |
| FR7.9 | The system shall track fine collection statistics | Should Have |

### 8.8 Reservation System

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR8.1 | The system shall allow members to reserve books that are currently issued | Should Have |
| FR8.2 | The system shall maintain reservation queue in first-come-first-served order | Should Have |
| FR8.3 | The system shall automatically notify members when reserved books become available | Should Have |
| FR8.4 | The system shall hold reserved books for 48 hours before releasing to next in queue | Should Have |
| FR8.5 | The system shall allow members to cancel their reservations | Should Have |
| FR8.6 | The system shall show reservation queue position to members | Should Have |
| FR8.7 | The system shall prevent reserving books that are already available | Should Have |
| FR8.8 | The system shall limit reservations to 5 books per member | Could Have |

### 8.9 Notification System

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR9.1 | The system shall send due date reminders 2 days before due date | Should Have |
| FR9.2 | The system shall send overdue notifications on the day book becomes overdue | Should Have |
| FR9.3 | The system shall send book return confirmation notifications | Should Have |
| FR9.4 | The system shall send reservation availability notifications | Should Have |
| FR9.5 | The system shall send notifications for book request approvals/rejections | Should Have |
| FR9.6 | The system shall support email notifications | Should Have |
| FR9.7 | The system shall support in-app notifications | Must Have |
| FR9.8 | The system shall allow users to mark notifications as read | Must Have |
| FR9.9 | The system shall allow users to configure notification preferences | Could Have |
| FR9.10 | The system shall send SMS notifications for critical alerts | Could Have |

### 8.10 Search & Filtering

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR10.1 | The system shall provide quick search functionality on homepage | Must Have |
| FR10.2 | The system shall allow advanced search with multiple filters | Should Have |
| FR10.3 | The system shall filter books by category | Must Have |
| FR10.4 | The system shall filter books by author | Should Have |
| FR10.5 | The system shall filter books by availability status | Must Have |
| FR10.6 | The system shall filter books by publication year | Could Have |
| FR10.7 | The system shall support partial keyword matching | Should Have |
| FR10.8 | The system shall display search results with relevance ranking | Should Have |
| FR10.9 | The system shall show search suggestions as user types | Could Have |
| FR10.10 | The system shall allow sorting results by title, author, or year | Should Have |

### 8.11 Dashboard & Reports

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR11.1 | The system shall display role-specific dashboards for Member, Librarian, and Admin | Must Have |
| FR11.2 | The system shall show key statistics on admin dashboard (total books, issued books, members, overdue books, fine collection) | Must Have |
| FR11.3 | The system shall generate reports on issued books with date range filter | Must Have |
| FR11.4 | The system shall generate reports on returned books | Should Have |
| FR11.5 | The system shall generate reports on overdue books with member details | Must Have |
| FR11.6 | The system shall generate reports on fine collection | Should Have |
| FR11.7 | The system shall generate member activity reports | Should Have |
| FR11.8 | The system shall show popular books based on issue frequency | Could Have |
| FR11.9 | The system shall show category-wise book distribution | Should Have |
| FR11.10 | The system shall allow exporting reports to PDF or Excel | Should Have |
| FR11.11 | The system shall display visual charts and graphs for statistics | Could Have |

### 8.12 Help & Support

| ID | Functional Requirement | Priority |
|----|------------------------|----------|
| FR12.1 | The system shall provide help desk/ticket system for user queries | Should Have |
| FR12.2 | The system shall allow users to submit support tickets | Should Have |
| FR12.3 | The system shall allow librarians/admins to respond to tickets | Should Have |
| FR12.4 | The system shall provide FAQ section | Could Have |
| FR12.5 | The system shall provide user guide/documentation | Could Have |
| FR12.6 | The system shall include chat system for real-time support | Could Have |

---

## 9. Non-Functional Requirements

### 9.1 Performance Requirements

| ID | Non-Functional Requirement | Priority |
|----|---------------------------|----------|
| NFR1.1 | The system shall load each page within 3 seconds under normal network conditions | Must Have |
| NFR1.2 | The system shall support at least 500 simultaneous users without performance degradation | Must Have |
| NFR1.3 | The system shall process book issue/return transactions within 2 seconds | Must Have |
| NFR1.4 | The system shall perform search queries and return results within 1 second | Should Have |
| NFR1.5 | The system shall handle database queries efficiently with proper indexing | Must Have |
| NFR1.6 | The system shall optimize images and assets for fast loading | Should Have |

### 9.2 Availability & Reliability

| ID | Non-Functional Requirement | Priority |
|----|---------------------------|----------|
| NFR2.1 | The system shall be available 99.5% of the time (allowing 3.6 hours downtime per month) | Must Have |
| NFR2.2 | The system shall perform automated daily backups of database | Must Have |
| NFR2.3 | The system shall have disaster recovery plan with backup restoration capability | Should Have |
| NFR2.4 | The system shall log all errors and exceptions for troubleshooting | Must Have |
| NFR2.5 | The system shall handle server failures gracefully with appropriate error messages | Should Have |
| NFR2.6 | The system shall maintain data integrity during concurrent transactions | Must Have |

### 9.3 Security Requirements

| ID | Non-Functional Requirement | Priority |
|----|---------------------------|----------|
| NFR3.1 | The system shall encrypt all passwords using bcrypt hashing algorithm | Must Have |
| NFR3.2 | The system shall implement JWT (JSON Web Token) based authentication | Must Have |
| NFR3.3 | The system shall enforce HTTPS for all communications | Must Have |
| NFR3.4 | The system shall implement role-based access control with proper authorization checks | Must Have |
| NFR3.5 | The system shall protect against SQL injection and XSS attacks | Must Have |
| NFR3.6 | The system shall implement CORS (Cross-Origin Resource Sharing) policy | Must Have |
| NFR3.7 | The system shall log all user activities for audit trail | Should Have |
| NFR3.8 | The system shall automatically log out users after 30 minutes of inactivity | Should Have |
| NFR3.9 | The system shall validate all user inputs on both client and server side | Must Have |
| NFR3.10 | The system shall comply with university data protection policies | Must Have |

### 9.4 Usability Requirements

| ID | Non-Functional Requirement | Priority |
|----|---------------------------|----------|
| NFR4.1 | The system shall be mobile-responsive and work on devices with screen sizes from 320px to 2560px | Must Have |
| NFR4.2 | The system shall have intuitive and user-friendly interface requiring minimal training | Must Have |
| NFR4.3 | The system shall provide clear error messages and validation feedback | Must Have |
| NFR4.4 | The system shall use consistent UI design patterns across all pages | Must Have |
| NFR4.5 | The system shall be accessible to users with disabilities (WCAG 2.1 Level AA compliance) | Should Have |
| NFR4.6 | The system shall support multiple browsers (Chrome, Firefox, Safari, Edge) | Must Have |
| NFR4.7 | The system shall provide visual feedback for all user actions | Should Have |
| NFR4.8 | The system shall use appropriate color contrast for readability | Should Have |
| NFR4.9 | The system shall support dark mode theme | Could Have |

### 9.5 Maintainability Requirements

| ID | Non-Functional Requirement | Priority |
|----|---------------------------|----------|
| NFR5.1 | The system shall follow modular architecture for easy maintenance and updates | Must Have |
| NFR5.2 | The system shall have well-documented code with comments | Should Have |
| NFR5.3 | The system shall separate frontend and backend for independent development | Must Have |
| NFR5.4 | The system shall use version control (Git) for code management | Must Have |
| NFR5.5 | The system shall follow coding standards and best practices | Should Have |
| NFR5.6 | The system shall allow easy configuration changes without code modification | Should Have |
| NFR5.7 | The system shall provide API documentation for future integrations | Could Have |

### 9.6 Scalability Requirements

| ID | Non-Functional Requirement | Priority |
|----|---------------------------|----------|
| NFR6.1 | The system shall be designed to scale horizontally by adding more servers | Should Have |
| NFR6.2 | The system shall handle growing database size (up to 100,000 books and 10,000 users) | Must Have |
| NFR6.3 | The system shall use efficient database queries with pagination for large datasets | Must Have |
| NFR6.4 | The system shall implement caching mechanisms for frequently accessed data | Should Have |

### 9.7 Compatibility Requirements

| ID | Non-Functional Requirement | Priority |
|----|---------------------------|----------|
| NFR7.1 | The system shall work on Windows, macOS, and Linux operating systems | Must Have |
| NFR7.2 | The system shall be compatible with modern web browsers (latest 2 versions) | Must Have |
| NFR7.3 | The system shall work on mobile devices (iOS and Android) | Must Have |
| NFR7.4 | The system shall support MongoDB version 4.0 or higher | Must Have |
| NFR7.5 | The system shall use Node.js version 14.0 or higher | Must Have |
| NFR7.6 | The system shall use React version 17.0 or higher | Must Have |

### 9.8 Data Requirements

| ID | Non-Functional Requirement | Priority |
|----|---------------------------|----------|
| NFR8.1 | The system shall store all data in secure MongoDB database | Must Have |
| NFR8.2 | The system shall maintain data consistency across all transactions | Must Have |
| NFR8.3 | The system shall implement data validation at database level | Must Have |
| NFR8.4 | The system shall retain transaction history for at least 5 years | Should Have |
| NFR8.5 | The system shall implement soft delete for critical data (books, users) | Should Have |
| NFR8.6 | The system shall compress and archive old data for storage optimization | Could Have |

### 9.9 Legal & Compliance Requirements

| ID | Non-Functional Requirement | Priority |
|----|---------------------------|----------|
| NFR9.1 | The system shall comply with university privacy policies | Must Have |
| NFR9.2 | The system shall not share user data with third parties without consent | Must Have |
| NFR9.3 | The system shall provide terms and conditions for users | Should Have |
| NFR9.4 | The system shall provide privacy policy document | Should Have |
| NFR9.5 | The system shall allow users to request data deletion (GDPR compliance) | Could Have |



---

## 10. System Models and Diagrams

### 10.1 Use Case Diagram

**Actors:**
- Member (Student/Faculty)
- Librarian
- Admin
- System (for automated processes)

**Use Cases:**

**Member Use Cases:**
- Register Account
- Login/Logout
- Search Books
- View Book Details
- Request Book Issue
- View My Books
- View Borrowing History
- Reserve Book
- Cancel Reservation
- View Fines
- Renew Book
- Update Profile
- View Notifications
- Submit Help Ticket

**Librarian Use Cases:**
- Login/Logout
- Add Book
- Edit Book
- Delete Book
- Search Books
- Process Book Issue
- Process Book Return
- Calculate Fine
- Record Fine Payment
- View Transactions
- Manage Reservations
- View Member Details
- Approve Book Requests
- Generate Reports
- Respond to Tickets

**Admin Use Cases:**
- All Librarian Use Cases (inheritance)
- Create User Account
- Edit User Account
- Delete User Account
- Assign User Roles
- Suspend/Activate Account
- View Dashboard Statistics
- Generate Comprehensive Reports
- Post Notices
- Configure System Settings
- View Activity Logs
- Manage Categories

**System Use Cases (Automated):**
- Send Due Date Reminders
- Send Overdue Notifications
- Update Overdue Status
- Calculate Fines Automatically
- Send Reservation Notifications
- Generate Member IDs

### 10.2 Use Case Descriptions

**Use Case 1: Search Books**
- **Actor:** Member, Librarian, Admin
- **Preconditions:** User is logged in
- **Main Flow:**
  1. User enters search query (title, author, ISBN, or keyword)
  2. System searches database for matching books
  3. System displays results with availability status
  4. User selects a book to view details
  5. System displays complete book information
- **Alternate Flow:**
  - 2a. No books found: System displays "No results found" message
  - 3a. User applies filters (category, availability): System refines results
- **Post-conditions:** User views book information

**Use Case 2: Request Book Issue**
- **Actor:** Member
- **Preconditions:** 
  - User is logged in
  - User has not exceeded borrowing limit (3 books)
  - User has no outstanding fines above ₹500
- **Main Flow:**
  1. Member searches and selects desired book
  2. Member clicks "Request Issue" button
  3. System checks book availability
  4. System creates book request with pending status
  5. System notifies librarian of new request
  6. System displays confirmation to member
- **Alternate Flow:**
  - 3a. Book not available: System offers reservation option
  - 3b. Member exceeded limit: System displays error message
  - 3c. Member has high outstanding fine: System blocks request
- **Post-conditions:** Book request created and pending approval

**Use Case 3: Process Book Issue**
- **Actor:** Librarian
- **Preconditions:** 
  - Librarian is logged in
  - Book request exists with pending status
  - Book is available
- **Main Flow:**
  1. Librarian views pending book requests
  2. Librarian selects a request to process
  3. Librarian verifies member eligibility
  4. Librarian approves request
  5. System creates transaction record with issue date and due date (7 days)
  6. System decrements available book count
  7. System updates request status to approved
  8. System sends notification to member
- **Alternate Flow:**
  - 3a. Member not eligible: Librarian rejects request with reason
  - 4a. Book becomes unavailable: System displays error
- **Post-conditions:** Book issued to member, transaction recorded

**Use Case 4: Process Book Return**
- **Actor:** Librarian
- **Preconditions:** 
  - Librarian is logged in
  - Book is currently issued to member
- **Main Flow:**
  1. Librarian searches for member or scans book
  2. System displays issued book details
  3. Librarian clicks "Process Return"
  4. System calculates fine if overdue
  5. System displays fine amount (if applicable)
  6. Librarian confirms return
  7. System updates transaction status to returned
  8. System increments available book count
  9. System checks for pending reservations
  10. System sends notification to member
- **Alternate Flow:**
  - 4a. Book overdue: Librarian collects fine before completing return
  - 9a. Reservation exists: System notifies next member in queue
- **Post-conditions:** Book returned, availability updated, fine recorded

**Use Case 5: Reserve Book**
- **Actor:** Member
- **Preconditions:** 
  - User is logged in
  - Book is currently issued (not available)
- **Main Flow:**
  1. Member views book details
  2. Member clicks "Reserve Book" button
  3. System checks if member already reserved this book
  4. System creates reservation with pending status
  5. System adds member to reservation queue
  6. System displays queue position to member
  7. System sends confirmation notification
- **Alternate Flow:**
  - 3a. Already reserved: System displays error message
  - 4a. Book becomes available: System offers direct issue instead
- **Post-conditions:** Reservation created, member added to queue

**Use Case 6: Generate Reports**
- **Actor:** Admin, Librarian
- **Preconditions:** User is logged in with appropriate role
- **Main Flow:**
  1. User navigates to Reports section
  2. User selects report type (Issued Books, Overdue Books, Fine Collection, etc.)
  3. User sets date range filters
  4. User clicks "Generate Report"
  5. System queries database for relevant data
  6. System formats data into report
  7. System displays report on screen
  8. User optionally exports to PDF/Excel
- **Alternate Flow:**
  - 5a. No data found: System displays "No records found" message
- **Post-conditions:** Report generated and displayed

### 10.3 Entity-Relationship (ER) Diagram

**Entities and Attributes:**

**1. User**
- _id (Primary Key)
- name
- email (Unique)
- password (Encrypted)
- role (Member/Librarian/Admin)
- memberId (Unique)
- department
- phone
- profilePicture
- bio
- dateOfBirth
- address (street, city, state, zipCode, country)
- emergencyContact (name, phone, relationship)
- status (Active/Inactive/Suspended)
- resetPasswordToken
- resetPasswordExpires
- createdAt
- updatedAt

**2. Book**
- _id (Primary Key)
- title
- author
- isbn (Unique)
- category
- publisher
- year
- copies (Total)
- available (Available copies)
- issued (Issued copies)
- location
- addedBy (Foreign Key → User)
- createdAt
- updatedAt

**3. Transaction**
- _id (Primary Key)
- bookId (Foreign Key → Book)
- memberId (Foreign Key → User)
- type (issue/return/renew)
- issueDate
- dueDate
- returnDate
- fine
- status (active/returned/overdue)
- processedBy (Foreign Key → User)
- createdAt
- updatedAt

**4. BookRequest**
- _id (Primary Key)
- bookId (Foreign Key → Book)
- userId (Foreign Key → User)
- status (pending/approved/rejected)
- createdAt

**5. Reservation**
- _id (Primary Key)
- bookId (Foreign Key → Book)
- userId (Foreign Key → User)
- status (pending/ready/cancelled/fulfilled)
- createdAt

**6. Notification**
- _id (Primary Key)
- title
- message
- type (info/success/warning/error/system)
- category
- priority (normal/high)
- sender
- userId (Foreign Key → User)
- read (Boolean)
- actions (Array)
- createdAt

**7. Payment**
- _id (Primary Key)
- transactionId (Foreign Key → Transaction)
- userId (Foreign Key → User)
- amount
- paymentDate
- paymentMethod
- status (paid/pending)
- createdAt

**8. Notice**
- _id (Primary Key)
- title
- content
- type (announcement/event/alert)
- priority (low/medium/high)
- postedBy (Foreign Key → User)
- expiryDate
- createdAt

**9. Ticket (Help Desk)**
- _id (Primary Key)
- userId (Foreign Key → User)
- subject
- description
- status (open/in-progress/resolved/closed)
- priority (low/medium/high)
- assignedTo (Foreign Key → User)
- responses (Array)
- createdAt
- updatedAt

**10. Event (Calendar)**
- _id (Primary Key)
- title
- description
- date
- type (holiday/event/maintenance)
- createdBy (Foreign Key → User)
- createdAt

**Relationships:**
- User (1) → (M) Transaction (One user can have many transactions)
- Book (1) → (M) Transaction (One book can have many transactions)
- User (1) → (M) BookRequest (One user can make many requests)
- Book (1) → (M) BookRequest (One book can have many requests)
- User (1) → (M) Reservation (One user can have many reservations)
- Book (1) → (M) Reservation (One book can have many reservations)
- User (1) → (M) Notification (One user can receive many notifications)
- Transaction (1) → (M) Payment (One transaction can have multiple payments)
- User (1) → (M) Ticket (One user can create many tickets)
- User (1) → (M) Book (One user/librarian adds many books)

### 10.4 Data Flow Diagram (DFD)

**Level 0 DFD (Context Diagram):**

External Entities:
- Member
- Librarian
- Admin

Processes:
- Library Management System (Single process)

Data Flows:
- Member → System: Login credentials, search queries, book requests, profile updates
- System → Member: Book information, notifications, transaction history, fines
- Librarian → System: Book data, transaction processing, member management
- System → Librarian: Reports, pending requests, member details
- Admin → System: User management, system configuration, report requests
- System → Admin: Statistics, comprehensive reports, activity logs

**Level 1 DFD (Major Processes):**

**Process 1: User Authentication**
- Input: Login credentials, registration data
- Output: Authentication token, user session
- Data Store: User Database

**Process 2: Book Management**
- Input: Book details, search queries, filters
- Output: Book information, search results, availability status
- Data Store: Book Database

**Process 3: Transaction Processing**
- Input: Issue requests, return data, member ID, book ID
- Output: Transaction records, updated availability, fine calculations
- Data Store: Transaction Database, Book Database

**Process 4: Fine Management**
- Input: Return date, due date, payment data
- Output: Fine amount, payment receipts, outstanding fines
- Data Store: Transaction Database, Payment Database

**Process 5: Reservation Management**
- Input: Reservation requests, cancellations
- Output: Queue position, availability notifications
- Data Store: Reservation Database

**Process 6: Notification System**
- Input: Transaction events, due dates, system events
- Output: Email notifications, in-app notifications
- Data Store: Notification Database

**Process 7: Report Generation**
- Input: Report type, date range, filters
- Output: Formatted reports, statistics, charts
- Data Store: All databases

**Level 2 DFD (Transaction Processing - Detailed):**

**Process 3.1: Validate Book Request**
- Check book availability
- Check member eligibility
- Check borrowing limit
- Check outstanding fines

**Process 3.2: Create Transaction**
- Generate transaction ID
- Set issue date and due date
- Record processing librarian
- Update book availability

**Process 3.3: Process Return**
- Verify transaction exists
- Calculate overdue days
- Calculate fine amount
- Update transaction status
- Update book availability

**Process 3.4: Check Reservations**
- Query reservation queue
- Notify next member
- Update reservation status

### 10.5 Activity Diagram

**Activity: Book Issue Process**

1. Start
2. Member logs in
3. Member searches for book
4. System displays search results
5. Member selects book
6. System checks availability
   - If available: Continue
   - If not available: Offer reservation → End
7. Member requests issue
8. System validates member eligibility
   - If eligible: Continue
   - If not eligible: Display error → End
9. System creates book request
10. System notifies librarian
11. Librarian reviews request
12. Librarian approves/rejects
    - If approved: Continue
    - If rejected: Notify member → End
13. System creates transaction
14. System updates book availability
15. System sends confirmation to member
16. End

**Activity: Book Return Process**

1. Start
2. Member brings book to library
3. Librarian logs in
4. Librarian searches for transaction
5. System displays transaction details
6. System checks due date
7. System calculates fine (if overdue)
   - If overdue: Display fine amount
   - If not overdue: Fine = 0
8. Librarian processes return
9. If fine > 0: Librarian collects payment
10. System updates transaction status
11. System updates book availability
12. System checks for reservations
    - If reservation exists: Notify next member
    - If no reservation: Continue
13. System sends confirmation to member
14. End

### 10.6 State Diagram

**Book State Diagram:**
- Available → Issued (when book is issued)
- Issued → Available (when book is returned)
- Issued → Overdue (when due date passes)
- Overdue → Available (when overdue book is returned)
- Available → Reserved (when all copies issued and reservation made)
- Reserved → Available (when reservation fulfilled or cancelled)
- Any State → Damaged (when book is damaged)
- Any State → Lost (when book is lost)

**Transaction State Diagram:**
- Created → Active (when book is issued)
- Active → Overdue (when due date passes)
- Active → Returned (when book is returned on time)
- Overdue → Returned (when overdue book is returned)
- Active → Renewed (when book is renewed)
- Renewed → Active (new due date set)

**Reservation State Diagram:**
- Created → Pending (when reservation is made)
- Pending → Ready (when book becomes available)
- Ready → Fulfilled (when member collects book)
- Pending/Ready → Cancelled (when member cancels)
- Ready → Expired (if not collected within 48 hours)

### 10.7 Sequence Diagram

**Sequence: Member Searches and Requests Book**

Actors: Member, System, Database, Librarian

1. Member → System: Enter search query
2. System → Database: Query books
3. Database → System: Return matching books
4. System → Member: Display search results
5. Member → System: Select book and request issue
6. System → Database: Check book availability
7. Database → System: Return availability status
8. System → Database: Check member eligibility
9. Database → System: Return eligibility status
10. System → Database: Create book request
11. Database → System: Confirm request created
12. System → Librarian: Send notification
13. System → Member: Display confirmation message

**Sequence: Librarian Processes Book Issue**

Actors: Librarian, System, Database, Member

1. Librarian → System: View pending requests
2. System → Database: Query pending requests
3. Database → System: Return request list
4. System → Librarian: Display requests
5. Librarian → System: Approve request
6. System → Database: Create transaction
7. Database → System: Confirm transaction created
8. System → Database: Update book availability
9. Database → System: Confirm update
10. System → Database: Update request status
11. Database → System: Confirm status updated
12. System → Member: Send notification
13. System → Librarian: Display success message



---

## 11. Prioritization of Requirements (MoSCoW Method)

### 11.1 Must Have (Critical - Release Blockers)

| Requirement ID | Description | Justification |
|----------------|-------------|---------------|
| FR1.1 - FR1.3 | User registration, login, role-based access | Core security and access control |
| FR2.3 - FR2.5 | Search books, view availability, request issue | Primary member functionality |
| FR2.6 - FR2.7 | View borrowed books and due dates | Essential for members to track books |
| FR3.1 - FR3.7 | Book CRUD operations, process issue/return | Core librarian functions |
| FR3.8 - FR3.9 | Automatic fine calculation and recording | Critical for library revenue |
| FR4.1 - FR4.6 | Admin user management and dashboard | System administration essentials |
| FR5.1 - FR5.5 | Book inventory management and tracking | Foundation of library system |
| FR6.1 - FR6.7 | Issue/return transaction processing | Core business process |
| FR7.1 - FR7.4 | Fine calculation and display | Revenue management |
| FR9.7 - FR9.8 | In-app notifications | User communication |
| FR10.1, FR10.3, FR10.5 | Search and filter functionality | Book discovery |
| FR11.1 - FR11.3 | Role-based dashboards and reports | Operational visibility |
| NFR1.1 - NFR1.3 | Performance requirements | User experience |
| NFR2.1, NFR2.2 | Availability and backup | System reliability |
| NFR3.1 - NFR3.6 | Security requirements | Data protection |
| NFR4.1 - NFR4.4 | Mobile responsiveness and usability | Accessibility |
| NFR5.1, NFR5.3, NFR5.4 | Maintainability and version control | Long-term sustainability |

### 11.2 Should Have (Important - High Priority)

| Requirement ID | Description | Justification |
|----------------|-------------|---------------|
| FR1.5 | Password reset functionality | User convenience |
| FR2.8 | View borrowing history | Member transparency |
| FR2.10 - FR2.13 | Reservation system and renewals | Enhanced user experience |
| FR3.10 - FR3.14 | Member management and reports | Operational efficiency |
| FR4.7 - FR4.11 | Activity logs and advanced reports | System monitoring |
| FR6.10 - FR6.11 | Book renewal functionality | User convenience |
| FR7.5 - FR7.7 | Partial payments and reminders | Fine management |
| FR8.1 - FR8.7 | Complete reservation system | Fair book allocation |
| FR9.1 - FR9.6 | Email and notification system | Proactive communication |
| FR10.2, FR10.4, FR10.7 - FR10.10 | Advanced search features | Improved book discovery |
| FR11.4 - FR11.10 | Comprehensive reporting | Data-driven decisions |
| FR12.1 - FR12.3 | Help desk system | User support |
| NFR2.3 - NFR2.5 | Disaster recovery and error logging | Risk mitigation |
| NFR3.7 - NFR3.9 | Audit trails and validation | Enhanced security |
| NFR4.5 - NFR4.8 | Accessibility and visual feedback | Inclusive design |
| NFR5.2, NFR5.5, NFR5.6 | Code documentation and configuration | Ease of maintenance |
| NFR6.1 - NFR6.4 | Scalability features | Future growth |

### 11.3 Could Have (Nice to Have - Low Priority)

| Requirement ID | Description | Justification |
|----------------|-------------|---------------|
| FR2.14 - FR2.16 | Wishlists, recommendations, reviews | Enhanced engagement |
| FR3.17 | Bulk book upload | Operational convenience |
| FR4.13 | Popular books analytics | Insights |
| FR5.10 | Book cover images | Visual appeal |
| FR7.8 | Fine waiver capability | Administrative flexibility |
| FR8.8 | Reservation limits | Resource management |
| FR9.9 - FR9.10 | Notification preferences and SMS | Customization |
| FR10.6, FR10.9 | Advanced filtering and suggestions | Enhanced search |
| FR11.11 | Visual charts and graphs | Data visualization |
| FR12.4 - FR12.6 | FAQ, documentation, chat support | Self-service support |
| NFR4.9 | Dark mode | User preference |
| NFR5.7 | API documentation | Future integrations |
| NFR6.6 | Data archiving | Storage optimization |
| NFR9.5 | GDPR compliance | Legal compliance |

### 11.4 Won't Have (Out of Scope for Current Release)

- Integration with university ERP system
- Mobile native applications (iOS/Android)
- Barcode/RFID scanning hardware integration
- E-book lending functionality
- Multi-language support
- Advanced analytics with AI/ML recommendations
- Social media integration
- Payment gateway integration for online fine payment
- Biometric authentication
- Video tutorials and interactive help

---

## 12. Assumptions and Constraints

### 12.1 Assumptions

**User Assumptions:**
1. All users (students, faculty, staff) have access to internet-enabled devices
2. Users have basic computer literacy and can navigate web applications
3. Users have valid university email addresses for registration
4. Members will return books in reasonable condition
5. Users will provide accurate information during registration
6. Library staff will be trained on the new system before deployment
7. Users will check their notifications regularly

**Technical Assumptions:**
1. University has reliable internet connectivity
2. MongoDB database server is available and accessible
3. Server infrastructure can handle expected user load
4. Email service is available for sending notifications
5. Users have modern web browsers (Chrome, Firefox, Safari, Edge)
6. Development team has access to required technologies (React, Node.js, MongoDB)
7. Version control system (Git/GitHub) is available for collaboration

**Operational Assumptions:**
1. Library will maintain current fine rate of ₹10 per day
2. Default borrowing period remains 7 days
3. Maximum borrowing limit remains 3 books per member
4. Library operating hours remain unchanged
5. Current book categorization system will be used
6. Physical books will still be managed alongside digital tracking
7. Librarian will be available to process transactions during library hours

**Business Assumptions:**
1. University management supports digital transformation
2. Budget is allocated for system development and maintenance
3. Library policies will be enforced through the system
4. System will be mandatory for all library transactions
5. Current manual system will be phased out after successful deployment
6. Library staff will adopt the new system
7. System will improve operational efficiency and user satisfaction

### 12.2 Constraints

**Technical Constraints:**
1. **Technology Stack:** Must use React.js (frontend), Node.js (backend), MongoDB (database) as per team expertise
2. **Development Time:** Project must be completed within 4 months (academic semester)
3. **Budget:** Limited to university-allocated budget (no commercial tools/services)
4. **Server Infrastructure:** Must use university's existing server infrastructure
5. **No Third-Party APIs:** Cannot use paid third-party services (payment gateways, SMS services)
6. **Browser Support:** Must support browsers available on university computers
7. **Database:** Must use MongoDB (no other database options)
8. **Hosting:** Must be hosted on university premises (no cloud hosting)

**Resource Constraints:**
1. **Team Size:** 4 team members with limited availability (part-time students)
2. **Development Tools:** Limited to free and open-source tools
3. **Testing Devices:** Limited to team members' personal devices
4. **Training Time:** Maximum 2 days for library staff training
5. **Documentation Time:** Must be completed alongside development
6. **Support:** No dedicated support team post-deployment

**Operational Constraints:**
1. **Library Hours:** System must work within library operating hours (8 AM - 8 PM)
2. **Downtime:** System updates must be done outside library hours
3. **Data Migration:** Must migrate existing book records (15,000+ books) from manual registers
4. **Parallel Operation:** May need to run parallel with manual system initially
5. **User Adoption:** Cannot force immediate adoption; gradual transition expected
6. **Physical Process:** Some processes (book handover) remain physical

**Security Constraints:**
1. **Compliance:** Must comply with university IT security policies
2. **Data Privacy:** Must protect student and faculty personal information
3. **Access Control:** Must implement strict role-based access
4. **Password Policy:** Must follow university password requirements
5. **Audit Requirements:** Must maintain logs for audit purposes
6. **Network Security:** Must work within university firewall restrictions

**Business Constraints:**
1. **Policy Adherence:** Must enforce existing library policies
2. **Fine Collection:** Must track but may not enforce online payment (cash collection continues)
3. **Book Damage:** System cannot assess physical book condition
4. **Lost Books:** Manual process for handling lost books continues
5. **Exceptions:** Librarian must have override capability for special cases
6. **Reporting:** Must generate reports in formats required by university administration

**Legal Constraints:**
1. **Data Protection:** Must comply with data protection regulations
2. **User Consent:** Must obtain user consent for data collection
3. **Intellectual Property:** Must use only licensed or open-source software
4. **Terms of Service:** Must have clear terms and conditions
5. **Privacy Policy:** Must have transparent privacy policy

**User Interface Constraints:**
1. **Accessibility:** Should be usable by users with basic computer skills
2. **Language:** English only (no multi-language support)
3. **Design:** Must follow university branding guidelines (if any)
4. **Responsiveness:** Must work on screens from 320px to 1920px width
5. **Loading Time:** Must load within 3 seconds on university network

---

## 13. Requirement Validation

### 13.1 Validation Activities

**Stakeholder Review Sessions:**
- **Date:** 10-12 January 2025
- **Participants:** Head Librarian, 2 Assistant Librarians, Library Admin, 5 Student Representatives, 2 Faculty Members
- **Duration:** 3 sessions of 2 hours each
- **Method:** Walkthrough of requirements document with feedback collection

**Validation Results:**
- ✅ All functional requirements reviewed and approved
- ✅ Non-functional requirements validated against university standards
- ✅ Use cases confirmed with actual workflow scenarios
- ✅ Priority levels agreed upon by all stakeholders
- ⚠️ Minor modifications requested (documented below)

### 13.2 Feedback and Changes

**From Library Staff:**
1. **Request:** Add ability to mark books as "Damaged" or "Lost"
   - **Action:** Added to FR3.16 (Should Have)
   - **Status:** Incorporated

2. **Request:** Need bulk book addition feature for efficiency
   - **Action:** Added to FR3.17 (Could Have)
   - **Status:** Incorporated

3. **Request:** Want to see member's borrowing history before issuing books
   - **Action:** Already covered in FR3.10
   - **Status:** Confirmed

4. **Concern:** Fine calculation should be configurable (not hardcoded ₹10)
   - **Action:** Added to FR4.8 (Admin can configure fine rates)
   - **Status:** Incorporated

**From Students:**
1. **Request:** Want to see which librarian processed their transaction
   - **Action:** Already captured in Transaction model (processedBy field)
   - **Status:** Confirmed

2. **Request:** Need mobile app for easier access
   - **Action:** Marked as "Won't Have" for current release; mobile-responsive web app provided instead
   - **Status:** Explained and accepted

3. **Request:** Want to rate and review books
   - **Action:** Added to FR2.16 (Could Have - low priority)
   - **Status:** Incorporated

4. **Request:** Extend borrowing period to 14 days
   - **Action:** Operational policy decision, not system requirement; system supports configurable periods
   - **Status:** Noted for library management decision

**From Faculty:**
1. **Request:** Faculty should have different borrowing limits and periods than students
   - **Action:** Added to system configuration (FR4.8)
   - **Status:** Incorporated

2. **Request:** Need priority access to new arrivals
   - **Action:** Operational policy, not system feature
   - **Status:** Noted for library policy

3. **Request:** Want to recommend books to students
   - **Action:** Marked as future enhancement
   - **Status:** Out of scope for current release

**From IT Department:**
1. **Concern:** Need comprehensive error logging for troubleshooting
   - **Action:** Already covered in NFR2.4
   - **Status:** Confirmed

2. **Request:** Need database backup automation
   - **Action:** Already covered in NFR2.2
   - **Status:** Confirmed

3. **Concern:** Security requirements must include input validation
   - **Action:** Added to NFR3.9
   - **Status:** Incorporated

**From University Management:**
1. **Request:** Need monthly usage reports for administration
   - **Action:** Already covered in FR11.3 and FR11.7
   - **Status:** Confirmed

2. **Request:** System should track fine collection for accounting
   - **Action:** Already covered in FR7.3 and FR11.6
   - **Status:** Confirmed

3. **Concern:** Data privacy compliance
   - **Action:** Added privacy policy requirement (NFR9.3, NFR9.4)
   - **Status:** Incorporated

### 13.3 Requirements Traceability

All requirements have been traced back to:
- **Stakeholder needs** identified in interviews
- **Survey responses** from 230 participants
- **Observation findings** from 5-day field study
- **Document analysis** of existing processes
- **Best practices** from competitive analysis

### 13.4 Validation Criteria

Requirements validated against:
1. **Completeness:** All stakeholder needs addressed
2. **Consistency:** No conflicting requirements
3. **Feasibility:** Technically achievable within constraints
4. **Testability:** Each requirement can be verified
5. **Clarity:** Unambiguous and understandable
6. **Necessity:** Each requirement serves a purpose
7. **Priority:** Correctly prioritized using MoSCoW method

### 13.5 Sign-off

**Approved By:**
- Ms. Priya Sharma (Head Librarian) - ✅ Approved on 12 Jan 2025
- Mr. Suresh Patil (Library Administrator) - ✅ Approved on 12 Jan 2025
- Dr. Amit Verma (Faculty Representative) - ✅ Approved on 12 Jan 2025
- Student Council Representative - ✅ Approved on 12 Jan 2025
- Mr. Anil Joshi (IT Department) - ✅ Approved on 12 Jan 2025

**Pending Approvals:**
- University Management (Final approval expected by 20 Jan 2025)

---

## 14. Conclusion

### 14.1 Summary

This Requirement Gathering Document provides a comprehensive overview of the Library Automation and Book Tracking System requirements. Through systematic requirement gathering using interviews, surveys, observation, and document analysis, we have identified and documented:

- **12 major functional requirement categories** with 100+ specific requirements
- **9 non-functional requirement categories** covering performance, security, usability, and maintainability
- **Detailed system models** including use cases, ER diagrams, DFDs, activity diagrams, and sequence diagrams
- **Prioritized requirements** using MoSCoW method for phased implementation
- **Clear assumptions and constraints** to guide development
- **Validated requirements** with stakeholder approval

### 14.2 Key Findings

**Current System Problems:**
- Manual processes causing inefficiency (12-15 minutes per transaction)
- Lack of real-time book availability information
- Frequent fine calculation disputes
- No automated notifications leading to overdue books
- Difficulty in generating reports and tracking statistics
- Poor user experience with long wait times

**Proposed Solution Benefits:**
- **For Members:** Easy book search, real-time availability, online requests, automated notifications, transparent fine tracking
- **For Librarians:** Automated fine calculation, efficient transaction processing, comprehensive member management, easy reporting
- **For Admins:** Complete system oversight, detailed analytics, user management, configurable settings
- **For University:** Improved library efficiency, better resource utilization, data-driven decisions, enhanced user satisfaction

### 14.3 Expected Outcomes

**Efficiency Improvements:**
- Reduce transaction time from 12-15 minutes to 2-3 minutes (80% reduction)
- Eliminate manual register maintenance (save 2 hours daily)
- Reduce book search time from 15-20 minutes to under 1 minute
- Automate fine calculation (eliminate disputes)

**User Experience Improvements:**
- 24/7 access to book catalog and personal account
- Real-time availability information
- Automated due date reminders (reduce overdue cases)
- Mobile-friendly interface for on-the-go access
- Transparent fine tracking and history

**Operational Improvements:**
- Accurate book inventory tracking
- Comprehensive reporting and analytics
- Reduced errors in data entry
- Better resource allocation based on usage patterns
- Improved fine collection tracking

### 14.4 Next Steps

**Phase 1: System Design (Weeks 1-2)**
- Create detailed Software Requirements Specification (SRS)
- Design database schema
- Create UI/UX mockups and wireframes
- Define API endpoints and data models
- Set up development environment

**Phase 2: Development (Weeks 3-12)**
- Sprint 1-2: User authentication and authorization
- Sprint 3-4: Book management module
- Sprint 5-6: Transaction processing (issue/return)
- Sprint 7-8: Member portal and search functionality
- Sprint 9-10: Admin dashboard and reporting
- Sprint 11-12: Notifications, reservations, and fine management

**Phase 3: Testing (Weeks 13-14)**
- Unit testing of all modules
- Integration testing
- User acceptance testing with library staff
- Performance and security testing
- Bug fixes and refinements

**Phase 4: Deployment (Weeks 15-16)**
- Data migration from manual registers
- System deployment on university server
- Library staff training (2 days)
- Pilot launch with limited users
- Full launch and transition from manual system

**Phase 5: Post-Deployment (Ongoing)**
- User support and issue resolution
- System monitoring and maintenance
- Gather feedback for improvements
- Plan for future enhancements

### 14.5 Success Metrics

The system will be considered successful if:
1. **User Adoption:** 90% of library users actively using the system within 3 months
2. **Transaction Time:** Average transaction time reduced to under 3 minutes
3. **System Availability:** 99.5% uptime achieved
4. **User Satisfaction:** 85% positive feedback in post-deployment survey
5. **Overdue Reduction:** 30% reduction in overdue books due to automated reminders
6. **Fine Collection:** 20% improvement in fine collection rate
7. **Operational Efficiency:** 50% reduction in administrative workload for library staff
8. **Error Reduction:** 95% reduction in data entry errors

### 14.6 Risk Mitigation

**Identified Risks:**
1. **User Resistance:** Mitigated by training and gradual transition
2. **Data Migration Errors:** Mitigated by careful validation and parallel operation
3. **Technical Issues:** Mitigated by thorough testing and IT support
4. **Performance Problems:** Mitigated by load testing and optimization
5. **Security Breaches:** Mitigated by following security best practices

### 14.7 Conclusion Statement

The Library Automation and Book Tracking System addresses critical pain points in the current manual library management process. With comprehensive requirements gathered from all stakeholders and validated through multiple methods, the project is well-positioned for successful implementation. The system will significantly improve operational efficiency, enhance user experience, and provide valuable insights through analytics and reporting.

This document serves as the foundation for the Software Requirements Specification (SRS) and will guide the development team throughout the project lifecycle. All stakeholders have reviewed and approved the requirements, ensuring alignment with organizational goals and user needs.

**Document Status:** ✅ Approved and Ready for Next Phase

---

## 15. Appendices

### Appendix A: Interview Transcripts

**Interview 1: Ms. Priya Sharma (Head Librarian)**
- Date: 8 January 2025
- Duration: 35 minutes
- Key Points:
  - Current system takes too much time for data entry
  - Frequent errors in manual registers
  - Difficulty tracking overdue books
  - Need for automated reminders
  - Want dashboard to see daily statistics
  - Fine calculation disputes are common
  - Book inventory audit is time-consuming

**Interview 2: Student Focus Group**
- Date: 9 January 2025
- Participants: 8 students from various departments
- Duration: 45 minutes
- Key Points:
  - Cannot find books even when available
  - Want to check availability before visiting
  - Prefer mobile-friendly interface
  - Want email notifications for due dates
  - Interested in seeing borrowing history
  - Want to reserve books that are issued

*(Full transcripts available in separate document)*

### Appendix B: Survey Questionnaire

**Library Management System - User Survey**

**Section 1: Demographics**
1. Your role: ☐ Student ☐ Faculty ☐ Staff
2. Department: _______________
3. How often do you visit the library?
   ☐ Daily ☐ 2-3 times/week ☐ Weekly ☐ Monthly ☐ Rarely

**Section 2: Current System Experience**
4. How do you currently find books? (Multiple choice)
   ☐ Card catalog ☐ Ask librarian ☐ Browse shelves ☐ Other
5. Rate your satisfaction with current book search process (1-5): ___
6. Have you faced issues with room availability information?
   ☐ Yes, frequently ☐ Sometimes ☐ Rarely ☐ Never
7. Have you experienced fine calculation disputes?
   ☐ Yes ☐ No

**Section 3: Desired Features**
8. Would you use an online book search system? ☐ Yes ☐ No
9. How important is real-time availability? (1-5): ___
10. Would you like email notifications for due dates? ☐ Yes ☐ No
11. Would you use a mobile-friendly system? ☐ Yes ☐ No
12. What features would you like? (Multiple choice)
    ☐ Online search ☐ Book reservation ☐ Borrowing history
    ☐ Fine tracking ☐ Book recommendations ☐ Reviews/ratings

*(Full survey with 25 questions available in Google Forms)*

### Appendix C: Observation Notes

**Date:** 6-10 January 2025
**Location:** University Central Library
**Observer:** Team Members

**Day 1 Observations (Monday, 6 Jan):**
- Peak hours: 11 AM - 1 PM (45 students in queue)
- Average wait time: 22 minutes
- Observed 12 book issues, 8 returns
- 3 students couldn't find books on shelves
- 1 fine calculation dispute (took 10 minutes to resolve)
- Librarian spent 30 minutes updating registers

**Day 2 Observations (Wednesday, 8 Jan):**
- New book arrival day - very busy
- 18 book issues, 12 returns processed
- Average transaction time: 14 minutes
- 2 data entry errors noticed by librarian
- Students asking about book availability before searching

*(Full observation notes available in separate document)*

### Appendix D: System Diagrams

*(Include high-resolution versions of:)*
- Use Case Diagram
- ER Diagram
- DFD Level 0, 1, and 2
- Activity Diagrams
- Sequence Diagrams
- State Diagrams
- UI Wireframes (to be created in design phase)

### Appendix E: Existing Forms and Documents

*(Include scanned copies of:)*
- Current book issue form
- Book return form
- Member registration form
- Fine receipt format
- Library rules and regulations
- Annual library report (previous year)

### Appendix F: Competitive Analysis

**System 1: LibraryWorld**
- Features: Book cataloging, circulation, OPAC
- Pros: Comprehensive features, cloud-based
- Cons: Expensive, complex interface
- Lessons: Keep interface simple, focus on core features

**System 2: Koha**
- Features: Open-source ILS, web-based
- Pros: Free, customizable, active community
- Cons: Requires technical expertise to set up
- Lessons: Modular architecture, good documentation

**System 3: University X Library System**
- Features: Custom-built for university
- Pros: Tailored to needs, mobile-friendly
- Cons: Limited reporting
- Lessons: Prioritize mobile responsiveness, comprehensive reporting

### Appendix G: Glossary

- **ILS:** Integrated Library System
- **OPAC:** Online Public Access Catalog
- **ISBN:** International Standard Book Number
- **CRUD:** Create, Read, Update, Delete
- **JWT:** JSON Web Token
- **CORS:** Cross-Origin Resource Sharing
- **API:** Application Programming Interface
- **UI/UX:** User Interface / User Experience
- **SRS:** Software Requirements Specification
- **DFD:** Data Flow Diagram
- **ER:** Entity-Relationship
- **NFR:** Non-Functional Requirement
- **FR:** Functional Requirement

### Appendix H: References

1. IEEE Standard 830-1998: IEEE Recommended Practice for Software Requirements Specifications
2. "Software Engineering" by Ian Sommerville (10th Edition)
3. "Requirements Engineering: Processes and Techniques" by Gerald Kotonya and Ian Sommerville
4. University Library Management Policies and Procedures Manual
5. MongoDB Documentation: https://docs.mongodb.com
6. React.js Documentation: https://reactjs.org/docs
7. Node.js Best Practices: https://nodejs.org/en/docs

### Appendix I: Contact Information

**Project Team:**
- Lalit Kumawat (Leader): lalit@university.edu
- Nikhil Kunder: nikhil@university.edu
- Pratiksha Lad: pratiksha@university.edu
- Menka Rajak: menka@university.edu

**Stakeholder Contacts:**
- Ms. Priya Sharma (Head Librarian): priya.sharma@university.edu
- Mr. Suresh Patil (Library Admin): suresh.patil@university.edu
- Mr. Anil Joshi (IT Support): anil.joshi@university.edu

**Project Supervisor:**
- [Supervisor Name]: [email]

---

**End of Document**

**Document Version:** 1.0  
**Last Updated:** 15 January 2025  
**Next Review Date:** 1 February 2025 (After SRS completion)  
**Document Status:** ✅ Approved

