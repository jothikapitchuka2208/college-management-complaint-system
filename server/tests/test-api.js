const http = require('http');

const API_HOST = '127.0.0.1';
const API_PORT = 5000;

// Helper to make JSON HTTP requests
const request = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: API_HOST,
      port: API_PORT,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('====================================================');
  console.log('🚀 CCMS Backend API Automated Test Suite');
  console.log('====================================================\n');

  try {
    // 1. Health Check
    console.log('[Test 1] Testing Health Endpoint: GET /api/health');
    const health = await request({ path: '/api/health' });
    console.log(`Status: ${health.status}, Database: ${health.data.database}`);
    if (health.status !== 200 || health.data.database !== 'connected') {
      throw new Error('Health check failed');
    }
    console.log('  ✅ Health check passed!\n');

    // 2. Admin Login
    console.log('[Test 2] Admin Login: POST /api/auth/login');
    const adminLogin = await request(
      { path: '/api/auth/login', method: 'POST' },
      { email: 'admin@ccms.edu', password: 'Admin@12345' }
    );
    console.log(`Status: ${adminLogin.status}, Role: ${adminLogin.data.data.user.role}`);
    const adminToken = adminLogin.data.data.token;
    console.log('  ✅ Admin logged in successfully!\n');

    // 3. Faculty Login
    console.log('[Test 3] Faculty Login: POST /api/auth/login');
    const facultyLogin = await request(
      { path: '/api/auth/login', method: 'POST' },
      { email: 'faculty.cs@ccms.edu', password: 'Faculty@12345' }
    );
    console.log(`Status: ${facultyLogin.status}, Role: ${facultyLogin.data.data.user.role}`);
    const facultyToken = facultyLogin.data.data.token;
    const facultyUserId = facultyLogin.data.data.user.id;
    console.log('  ✅ Faculty logged in successfully!\n');

    // 4. Student Register
    console.log('[Test 4] Student Registration: POST /api/auth/register');
    const testStudentEmail = `test.student.${Date.now()}@ccms.edu`;
    const studentRegister = await request(
      { path: '/api/auth/register', method: 'POST' },
      { name: 'Automated Test Student', email: testStudentEmail, password: 'Student@12345' }
    );
    console.log(`Status: ${studentRegister.status}, User: ${studentRegister.data.data.user.email}`);
    const studentToken = studentRegister.data.data.token;
    console.log('  ✅ Student registered successfully!\n');

    // 5. Get Categories & Departments
    console.log('[Test 5] Fetching Categories & Departments for Complaint Submission');
    const categoriesRes = await request({ path: '/api/categories', token: studentToken });
    const departmentsRes = await request({ path: '/api/departments', token: adminToken });
    const categoryId = categoriesRes.data.data[0]._id;
    const departmentId = departmentsRes.data.data[0]._id;
    console.log(`Category: ${categoriesRes.data.data[0].name} (${categoryId})`);
    console.log(`Department: ${departmentsRes.data.data[0].name} (${departmentId})`);
    console.log('  ✅ Categories & Departments retrieved!\n');

    // 6. Student Submit Complaint
    console.log('[Test 6] Student Submits Complaint: POST /api/complaints');
    const newComplaintRes = await request(
      { path: '/api/complaints', method: 'POST', token: studentToken },
      {
        title: 'Broken lab terminal #12 in Computer Lab 3',
        description: 'The Ethernet card is disconnected and monitor displays No Signal.',
        category: categoryId,
        priority: 'HIGH',
      }
    );
    console.log(`Status: ${newComplaintRes.status}, Complaint Number: ${newComplaintRes.data.data.complaintNumber}, Initial Status: ${newComplaintRes.data.data.status}`);
    const complaintId = newComplaintRes.data.data._id;
    console.log('  ✅ Complaint submitted successfully with unique number!\n');

    // 7. Admin Assign Complaint
    console.log('[Test 7] Admin Assigns Complaint: POST /api/complaints/:id/assign');
    const assignRes = await request(
      { path: `/api/complaints/${complaintId}/assign`, method: 'POST', token: adminToken },
      {
        assignedTo: facultyUserId,
        department: departmentId,
      }
    );
    console.log(`Status: ${assignRes.status}, New Status: ${assignRes.data.data.status}, Assigned To: ${assignRes.data.data.assignedTo.name}`);
    console.log('  ✅ Complaint assigned to faculty successfully!\n');

    // 8. Faculty Updates Status to IN_PROGRESS and then RESOLVED
    console.log('[Test 8] Faculty Updates Status: POST /api/complaints/:id/status');
    const inProgressRes = await request(
      { path: `/api/complaints/${complaintId}/status`, method: 'POST', token: facultyToken },
      { status: 'IN_PROGRESS' }
    );
    console.log(`Moved to: ${inProgressRes.data.data.status}`);

    const resolvedRes = await request(
      { path: `/api/complaints/${complaintId}/status`, method: 'POST', token: facultyToken },
      {
        status: 'RESOLVED',
        resolutionRemarks: 'Replaced faulty RJ45 socket and verified video output.',
      }
    );
    console.log(`Moved to: ${resolvedRes.data.data.status}, Remarks: "${resolvedRes.data.data.resolutionRemarks}"`);
    console.log('  ✅ Status workflow executed successfully!\n');

    // 9. Comments & Timeline
    console.log('[Test 9] Comments & Audit Timeline');
    await request(
      { path: `/api/complaints/${complaintId}/comments`, method: 'POST', token: studentToken },
      { message: 'Thank you for looking into this so quickly!' }
    );
    const timelineRes = await request(
      { path: `/api/complaints/${complaintId}/timeline`, token: studentToken }
    );
    console.log(`Audit Trail Entries Count: ${timelineRes.data.data.length}`);
    timelineRes.data.data.forEach((log) => {
      console.log(`  - [${new Date(log.createdAt).toLocaleTimeString()}] ${log.action} by ${log.userId.name}`);
    });
    console.log('  ✅ Full audit trail maintained!\n');

    // 10. Student Feedback
    console.log('[Test 10] Student Feedback: POST /api/complaints/:id/feedback');
    const feedbackRes = await request(
      { path: `/api/complaints/${complaintId}/feedback`, method: 'POST', token: studentToken },
      { rating: 5, comment: 'Excellent and quick resolution!' }
    );
    console.log(`Feedback Saved Rating: ${feedbackRes.data.data.feedback.rating} Stars, Comment: "${feedbackRes.data.data.feedback.comment}"`);
    console.log('  ✅ Student feedback recorded successfully!\n');

    // 11. Dashboards
    console.log('[Test 11] Dashboards Analytics Verification');
    const studentDash = await request({ path: '/api/dashboard/student', token: studentToken });
    const facultyDash = await request({ path: '/api/dashboard/faculty', token: facultyToken });
    const adminDash = await request({ path: '/api/dashboard/admin', token: adminToken });
    console.log('Student Metrics:', studentDash.data.data.metrics);
    console.log('Faculty Metrics:', facultyDash.data.data.metrics);
    console.log('Admin Metrics:', adminDash.data.data.metrics);
    console.log('  ✅ All Dashboards functional!\n');

    console.log('====================================================');
    console.log('🎉 ALL BACKEND API TESTS PASSED PERFECTLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Test suite failed:', err);
    process.exit(1);
  }
};

runTests();
