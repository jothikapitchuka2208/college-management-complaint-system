const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const Department = require('../models/Department');
const Category = require('../models/Category');
const Complaint = require('../models/Complaint');
const ComplaintLog = require('../models/ComplaintLog');
const Comment = require('../models/Comment');
const Counter = require('../models/Counter');
const logger = require('./logger');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(env.mongodbUri);
    }
    logger.info('[Seed] Checking and seeding initial database data...');

    // 1. Seed Departments
    const initialDepartments = [
      { name: 'Computer Science', description: 'Department of Computer Science and Engineering' },
      { name: 'Administration', description: 'Central College Administrative Office' },
      { name: 'Examination Cell', description: 'Examination & Evaluation Cell' },
      { name: 'Hostel', description: 'Hostel & Residential Life Management' },
      { name: 'Library', description: 'Central Library & Reading Rooms' },
      { name: 'Transport', description: 'College Bus & Commuter Transportation Services' },
      { name: 'Accounts', description: 'Student Accounts & Fee Settlement Office' },
      { name: 'IT Support', description: 'Campus Wi-Fi, Lab Hardware & Network Support' },
    ];

    const departmentMap = {};
    for (const d of initialDepartments) {
      let dept = await Department.findOne({ name: d.name });
      if (!dept) {
        dept = await Department.create(d);
      }
      departmentMap[d.name] = dept._id;
    }

    // 2. Seed Categories
    const initialCategories = [
      { name: 'Academic', description: 'Curriculum, lectures, faculty feedback, scheduling' },
      { name: 'Hostel', description: 'Hostel rooms, cleanliness, mess food, hot water, curfew' },
      { name: 'Transport', description: 'Bus routes, delays, passes, driver assistance' },
      { name: 'Library', description: 'Book availability, digital library access, quiet hours' },
      { name: 'Laboratory', description: 'Equipment malfunction, software licenses, lab safety' },
      { name: 'Infrastructure', description: 'Classroom AC, lighting, washroom maintenance, elevators' },
      { name: 'Examination', description: 'Hall tickets, re-evaluation, exam schedule clashes' },
      { name: 'Fees', description: 'Payment gateway issues, receipt generation, scholarship disbursement' },
      { name: 'IT/Technical', description: 'Campus Wi-Fi connectivity, LMS portal access, login credentials' },
      { name: 'Canteen', description: 'Food hygiene, pricing, cafeteria seating' },
      { name: 'Security', description: 'Campus safety, lost & found, vehicle parking' },
      { name: 'Other', description: 'General grievances and miscellaneous requests' },
    ];

    const categoryMap = {};
    for (const c of initialCategories) {
      let cat = await Category.findOne({ name: c.name });
      if (!cat) {
        cat = await Category.create(c);
      }
      categoryMap[c.name] = cat._id;
    }

    // 3. Seed Users (Admin, Faculty, Students)
    // Admin
    let admin = await User.findOne({ email: 'admin@ccms.edu' });
    if (!admin) {
      admin = await User.create({
        name: 'College Administrator',
        email: 'admin@ccms.edu',
        password: 'Admin@12345',
        role: 'admin',
      });
    }

    // Faculty CS
    let facultyCS = await User.findOne({ email: 'faculty.cs@ccms.edu' });
    if (!facultyCS) {
      facultyCS = await User.create({
        name: 'Dr. Alan Turing',
        email: 'faculty.cs@ccms.edu',
        password: 'Faculty@12345',
        role: 'faculty',
        department: departmentMap['Computer Science'],
      });
    }

    // Faculty Hostel
    let facultyHostel = await User.findOne({ email: 'faculty.hostel@ccms.edu' });
    if (!facultyHostel) {
      facultyHostel = await User.create({
        name: 'Warden Sharma',
        email: 'faculty.hostel@ccms.edu',
        password: 'Faculty@12345',
        role: 'faculty',
        department: departmentMap['Hostel'],
      });
    }

    // Faculty IT
    let facultyIT = await User.findOne({ email: 'faculty.it@ccms.edu' });
    if (!facultyIT) {
      facultyIT = await User.create({
        name: 'Prof. Grace Hopper',
        email: 'faculty.it@ccms.edu',
        password: 'Faculty@12345',
        role: 'faculty',
        department: departmentMap['IT Support'],
      });
    }

    // Students
    let student1 = await User.findOne({ email: 'student1@ccms.edu' });
    if (!student1) {
      student1 = await User.create({
        name: 'Rahul Verma',
        email: 'student1@ccms.edu',
        password: 'Student@12345',
        role: 'student',
      });
    }

    let student2 = await User.findOne({ email: 'student2@ccms.edu' });
    if (!student2) {
      student2 = await User.create({
        name: 'Priya Patel',
        email: 'student2@ccms.edu',
        password: 'Student@12345',
        role: 'student',
      });
    }

    // 4. Seed Sample Complaints if none exist
    const complaintCount = await Complaint.countDocuments();
    if (complaintCount === 0) {
      logger.info('[Seed] Seeding sample complaints in various lifecycle states...');

      // Sample 1: PENDING
      const c1 = await Complaint.create({
        complaintNumber: 'CMP-2026-00001',
        title: 'Projector malfunction in Room 302 CS Block',
        description: 'The ceiling projector in CS lecture hall 302 has a blown bulb and flickers intermittently during afternoon lectures.',
        category: categoryMap['Infrastructure'],
        department: null,
        priority: 'HIGH',
        status: 'PENDING',
        submittedBy: student1._id,
      });
      await ComplaintLog.create({
        complaintId: c1._id,
        userId: student1._id,
        action: 'Complaint Created',
        newValue: { complaintNumber: 'CMP-2026-00001', status: 'PENDING', priority: 'HIGH' },
      });

      // Sample 2: ASSIGNED
      const c2 = await Complaint.create({
        complaintNumber: 'CMP-2026-00002',
        title: 'Hostel Block B 3rd Floor Water Heater not working',
        description: 'Since yesterday morning, the geyser unit in the 3rd floor west wing washroom is not heating water.',
        category: categoryMap['Hostel'],
        department: departmentMap['Hostel'],
        priority: 'URGENT',
        status: 'ASSIGNED',
        submittedBy: student2._id,
        assignedTo: facultyHostel._id,
      });
      await ComplaintLog.create({
        complaintId: c2._id,
        userId: student2._id,
        action: 'Complaint Created',
        newValue: { status: 'PENDING' },
      });
      await ComplaintLog.create({
        complaintId: c2._id,
        userId: admin._id,
        action: 'Complaint Assigned',
        newValue: { assignedTo: facultyHostel._id, status: 'ASSIGNED', department: departmentMap['Hostel'] },
      });

      // Sample 3: IN_PROGRESS
      const c3 = await Complaint.create({
        complaintNumber: 'CMP-2026-00003',
        title: 'Library Wi-Fi access point unreachable',
        description: 'Laptops in the 2nd floor silent study area are unable to authenticate to CCMS-Student-5G Wi-Fi hotspot.',
        category: categoryMap['IT/Technical'],
        department: departmentMap['IT Support'],
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        submittedBy: student1._id,
        assignedTo: facultyIT._id,
      });
      await ComplaintLog.create({
        complaintId: c3._id,
        userId: student1._id,
        action: 'Complaint Created',
      });
      await ComplaintLog.create({
        complaintId: c3._id,
        userId: admin._id,
        action: 'Complaint Assigned',
      });
      await ComplaintLog.create({
        complaintId: c3._id,
        userId: facultyIT._id,
        action: 'Status Changed to IN_PROGRESS',
        oldValue: 'ASSIGNED',
        newValue: 'IN_PROGRESS',
      });
      await Comment.create({
        complaintId: c3._id,
        author: facultyIT._id,
        message: 'Network engineers are replacing the firmware on access point AP-LIB-02 right now.',
      });

      // Sample 4: RESOLVED with feedback
      const c4 = await Complaint.create({
        complaintNumber: 'CMP-2026-00004',
        title: 'Incorrect fee receipt issued for Semester 5',
        description: 'The automated portal receipt did not reflect the library security deposit waiver.',
        category: categoryMap['Fees'],
        department: departmentMap['Accounts'],
        priority: 'MEDIUM',
        status: 'RESOLVED',
        submittedBy: student2._id,
        assignedTo: facultyCS._id,
        resolutionRemarks: 'Verified student scholarship voucher and regenerated revised fee receipt #REC-88421.',
        resolvedAt: new Date(Date.now() - 86400000),
        feedback: {
          rating: 5,
          comment: 'Very fast resolution! Thank you Accounts team.',
          createdAt: new Date(),
        },
      });
      await ComplaintLog.create({
        complaintId: c4._id,
        userId: student2._id,
        action: 'Complaint Created',
      });
      await ComplaintLog.create({
        complaintId: c4._id,
        userId: facultyCS._id,
        action: 'Status Changed to RESOLVED',
        oldValue: 'IN_PROGRESS',
        newValue: 'RESOLVED',
        metadata: { resolutionRemarks: 'Verified and regenerated receipt' },
      });

      // Set counter sequence
      await Counter.findOneAndUpdate(
        { name: `complaint_${new Date().getFullYear()}` },
        { seq: 4 },
        { upsert: true }
      );
    }

    logger.info('[Seed] Initial data verified and ready.');
  } catch (error) {
    logger.error('[Seed] Error seeding data:', error);
  }
};

module.exports = seedData;
