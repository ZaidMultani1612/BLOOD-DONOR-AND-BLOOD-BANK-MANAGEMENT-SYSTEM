import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Donor from '../models/Donor.js';
import BloodBank from '../models/BloodBank.js';
import Hospital from '../models/Hospital.js';
import Recipient from '../models/Recipient.js';
import BloodInventory from '../models/BloodInventory.js';
import BloodRequest from '../models/BloodRequest.js';
import Appointment from '../models/Appointment.js';
import Emergency from '../models/Emergency.js';
import DonationCamp from '../models/DonationCamp.js';
import Reward from '../models/Reward.js';
import Donation from '../models/Donation.js';
import Chat from '../models/Chat.js';

export const seedData = async (exitOnComplete = true) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
    console.log('[Seed] Clearing existing collections...');

    await Promise.all([
      User.deleteMany(),
      Donor.deleteMany(),
      BloodBank.deleteMany(),
      Hospital.deleteMany(),
      Recipient.deleteMany(),
      BloodInventory.deleteMany(),
      BloodRequest.deleteMany(),
      Appointment.deleteMany(),
      Emergency.deleteMany(),
      DonationCamp.deleteMany(),
      Reward.deleteMany(),
      Donation.deleteMany(),
      Chat.deleteMany(),
    ]);

    console.log('[Seed] Inserting users...');

    // 1. Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@bloodbank.com',
      password: 'adminpassword123',
      phone: '9876500000',
      pincode: '395009',
      address: 'HealthTech HQ, Ring Road',
      city: 'Surat',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    // 2. Blood Banks (Users + BloodBank profiles)
    const bankUsersData = [
      {
        name: 'Surat City Blood Bank',
        email: 'suratcity@bloodbank.com',
        phone: '9876540001',
        area: 'Rander',
        address: 'Rander Road, Surat, Gujarat',
        pincode: '395005',
        coordinates: { lat: 21.2185, lng: 72.7956 },
      },
      {
        name: 'Lifeline Blood Bank',
        email: 'lifeline@bloodbank.com',
        phone: '9876540002',
        area: 'Adajan',
        address: 'Adajan Gam, Surat, Gujarat',
        pincode: '395009',
        coordinates: { lat: 21.1959, lng: 72.7933 },
      },
      {
        name: 'Red Cross Blood Bank',
        email: 'redcross@bloodbank.com',
        phone: '9876540003',
        area: 'Udhna',
        address: 'Udhna Main Road, Surat, Gujarat',
        pincode: '394210',
        coordinates: { lat: 21.1517, lng: 72.8427 },
      },
      {
        name: 'Galaxy Blood Bank',
        email: 'galaxy@bloodbank.com',
        phone: '9876540004',
        area: 'Vesu',
        address: 'VIP Road, Vesu, Surat, Gujarat',
        pincode: '395007',
        coordinates: { lat: 21.1442, lng: 72.7758 },
      },
    ];

    const bloodBanks = [];
    for (const b of bankUsersData) {
      const u = await User.create({
        name: b.name,
        email: b.email,
        password: 'bankpassword123',
        phone: b.phone,
        pincode: b.pincode,
        address: b.address,
        city: 'Surat',
        role: 'bloodbank',
      });
      const bank = await BloodBank.create({
        user: u._id,
        name: b.name,
        phone: b.phone,
        email: b.email,
        address: b.address,
        area: b.area,
        city: 'Surat',
        pincode: b.pincode,
        coordinates: b.coordinates,
      });
      u.bloodBankProfile = bank._id;
      await u.save();
      bloodBanks.push(bank);
    }

    // 3. Hospitals
    const hospUser = await User.create({
      name: 'Civil Hospital Surat',
      email: 'civil@hospital.com',
      password: 'hospitalpassword123',
      phone: '9876530001',
      pincode: '395001',
      address: 'Majura Gate, Surat',
      city: 'Surat',
      role: 'hospital',
    });
    const hospital = await Hospital.create({
      user: hospUser._id,
      name: 'Civil Hospital Surat',
      phone: hospUser.phone,
      email: hospUser.email,
      address: hospUser.address,
      city: 'Surat',
      pincode: hospUser.pincode,
    });
    hospUser.hospitalProfile = hospital._id;
    await hospUser.save();

    // 4. Recipients
    const recUser = await User.create({
      name: 'John Doe',
      email: 'john@recipient.com',
      password: 'recipientpassword123',
      phone: '9876520001',
      pincode: '395009',
      address: 'Adajan, Surat',
      city: 'Surat',
      role: 'recipient',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });
    const recipient = await Recipient.create({
      user: recUser._id,
      bloodGroup: 'B+',
      city: 'Surat',
      pincode: '395009',
    });
    recUser.recipientProfile = recipient._id;
    await recUser.save();

    // 5. Donors matching UI screenshot (Page 2)
    const donorsSeed = [
      {
        name: 'Amit Patel',
        email: 'amit@donor.com',
        phone: '9876543210',
        bloodGroup: 'A+',
        location: 'Surat',
        count: 4,
        points: 200,
      },
      {
        name: 'Riya Sharma',
        email: 'riya@donor.com',
        phone: '9823456789',
        bloodGroup: 'B+',
        location: 'Vadodara',
        count: 2,
        points: 100,
      },
      {
        name: 'Mohit Shah',
        email: 'mohit@donor.com',
        phone: '9876541234',
        bloodGroup: 'O+',
        location: 'Ahmedabad',
        count: 7,
        points: 350,
      },
      {
        name: 'Neha Desai',
        email: 'neha@donor.com',
        phone: '9765432109',
        bloodGroup: 'AB+',
        location: 'Rajkot',
        count: 3,
        points: 150,
      },
      {
        name: 'Ishan Khan',
        email: 'ishan@donor.com',
        phone: '9898765432',
        bloodGroup: 'B-',
        location: 'Surat',
        count: 5,
        points: 250,
      },
      {
        name: 'Pooja Varma',
        email: 'pooja@donor.com',
        phone: '9811223344',
        bloodGroup: 'O-',
        location: 'Surat',
        count: 6,
        points: 300,
      },
      {
        name: 'Karan Joshi',
        email: 'karan@donor.com',
        phone: '9844556677',
        bloodGroup: 'A-',
        location: 'Surat',
        count: 1,
        points: 50,
      },
      {
        name: 'Simran Kaur',
        email: 'simran@donor.com',
        phone: '9877889900',
        bloodGroup: 'AB-',
        location: 'Surat',
        count: 2,
        points: 100,
      },
    ];

    const donors = [];
    for (const d of donorsSeed) {
      const u = await User.create({
        name: d.name,
        email: d.email,
        password: 'donorpassword123',
        phone: d.phone,
        pincode: '395009',
        address: `${d.location} Center`,
        city: d.location,
        role: 'donor',
      });
      const donor = await Donor.create({
        user: u._id,
        bloodGroup: d.bloodGroup,
        city: d.location,
        pincode: '395009',
        donationCount: d.count,
        rewardPoints: d.points,
        lastDonationDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      });
      u.donorProfile = donor._id;
      await u.save();
      donors.push(donor);

      // Create reward entry
      await Reward.create({
        donor: donor._id,
        user: u._id,
        title: d.points >= 250 ? 'Gold Savior' : 'Silver Hero',
        badgeType: d.points >= 250 ? 'Gold Savior' : 'Silver Hero',
        points: d.points,
        description: `Recognized for ${d.count} life-saving blood donations.`,
      });

      // Create verified donation record
      await Donation.create({
        donor: donor._id,
        donorUser: u._id,
        bloodBank: bloodBanks[0]._id,
        bloodGroup: d.bloodGroup,
        units: 1,
        donationDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        status: 'Verified',
        pointsAwarded: 50,
      });
    }

    console.log('[Seed] Populating Blood Inventory matching screenshot...');
    // Exactly matches Page 1 screenshot ("Blood Inventory")
    const inventoryPresets = [
      { bloodGroup: 'A+', units: 120, status: 'Normal', expiryDate: new Date('2025-12-30') },
      { bloodGroup: 'A-', units: 75, status: 'Low Stock', expiryDate: new Date('2025-12-25') },
      { bloodGroup: 'B+', units: 100, status: 'Normal', expiryDate: new Date('2025-12-28') },
      { bloodGroup: 'B-', units: 80, status: 'Normal', expiryDate: new Date('2025-12-20') },
      { bloodGroup: 'AB+', units: 60, status: 'Normal', expiryDate: new Date('2025-12-18') },
      { bloodGroup: 'AB-', units: 40, status: 'Low Stock', expiryDate: new Date('2025-12-15') },
      { bloodGroup: 'O+', units: 200, status: 'Normal', expiryDate: new Date('2026-01-10') },
      { bloodGroup: 'O-', units: 180, status: 'Normal', expiryDate: new Date('2026-01-12') },
    ];

    for (let i = 0; i < inventoryPresets.length; i++) {
      const p = inventoryPresets[i];
      await BloodInventory.create({
        bloodBank: bloodBanks[i % bloodBanks.length]._id,
        bloodGroup: p.bloodGroup,
        units: p.units,
        status: p.status,
        expiryDate: p.expiryDate,
        batchNumber: `BATCH-2025-${p.bloodGroup.replace('+', 'POS').replace('-', 'NEG')}`,
      });
    }

    // Additional stock for other blood banks to make map rich
    for (const bank of bloodBanks.slice(1)) {
      for (const bg of ['A+', 'B+', 'O+', 'AB+']) {
        await BloodInventory.create({
          bloodBank: bank._id,
          bloodGroup: bg,
          units: Math.floor(40 + Math.random() * 80),
          status: 'Normal',
          expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        });
      }
    }

    console.log('[Seed] Populating Blood Requests matching screenshot...');
    // Page 2 screenshot ("Blood Requests" table)
    const requestsSeed = [
      {
        patientName: 'Rahul Mehta',
        bloodGroup: 'B+',
        units: 2,
        urgency: 'High',
        status: 'Pending',
        requestId: '#BR001',
      },
      {
        patientName: 'Sneha Patel',
        bloodGroup: 'O+',
        units: 1,
        urgency: 'Medium',
        status: 'Approved',
        requestId: '#BR002',
      },
      {
        patientName: 'Amit Kumar',
        bloodGroup: 'A-',
        units: 3,
        urgency: 'High',
        status: 'Processing',
        requestId: '#BR003',
      },
      {
        patientName: 'Divya Sharma',
        bloodGroup: 'AB+',
        units: 1,
        urgency: 'Medium',
        status: 'Fulfilled',
        requestId: '#BR004',
      },
      {
        patientName: 'Rohit Singh',
        bloodGroup: 'O-',
        units: 2,
        urgency: 'Low',
        status: 'Rejected',
        requestId: '#BR005',
      },
    ];

    for (const r of requestsSeed) {
      await BloodRequest.create({
        requestId: r.requestId,
        requester: recUser._id,
        requesterRole: 'recipient',
        patientName: r.patientName,
        bloodGroup: r.bloodGroup,
        units: r.units,
        urgency: r.urgency,
        status: r.status,
        hospitalName: 'Civil Hospital Surat',
        bloodBank: bloodBanks[0]._id,
        contactPhone: '9876520001',
        city: 'Surat',
        pincode: '395009',
        statusHistory: [
          {
            status: r.status,
            changedAt: new Date(),
            changedBy: adminUser._id,
            note: 'Initial logged status',
          },
        ],
      });
    }

    console.log('[Seed] Populating Emergencies, Camps, Appointments...');
    // Active Emergencies
    await Emergency.create([
      {
        patientName: 'Aarav Desai',
        bloodGroup: 'O-',
        units: 3,
        hospitalName: 'Apollo Hospital Surat',
        location: 'Ring Road, Surat',
        contactPhone: '9876599901',
        urgencyLevel: 'Critical',
        status: 'Active',
      },
      {
        patientName: 'Kavita Joshi',
        bloodGroup: 'AB-',
        units: 2,
        hospitalName: 'Sunshine Care Hospital',
        location: 'Ghod Dod Road, Surat',
        contactPhone: '9876599902',
        urgencyLevel: 'Emergency',
        status: 'Active',
      },
      {
        patientName: 'Vikram Mehta',
        bloodGroup: 'A-',
        units: 4,
        hospitalName: 'Life Care Trauma Center',
        location: 'Vesu, Surat',
        contactPhone: '9876599903',
        urgencyLevel: 'Critical',
        status: 'Active',
      },
    ]);

    // Donation Camps
    await DonationCamp.create([
      {
        title: 'Mega City Blood Donation Camp',
        description: 'Annual mega blood drive in partnership with Indian Red Cross Society.',
        bloodBank: bloodBanks[0]._id,
        organizerName: 'Surat Youth Foundation & Red Cross',
        date: new Date('2025-06-15T09:00:00Z'),
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        venue: 'Surat Indoor Stadium, Athwalines',
        city: 'Surat',
        pincode: '395001',
        contactPhone: '9876540001',
        targetUnits: 300,
        collectedUnits: 45,
      },
      {
        title: 'Community Lifesaver Drive',
        description: 'Local neighborhood voluntary blood camp. Refreshments and certificates provided.',
        bloodBank: bloodBanks[1]._id,
        organizerName: 'Rotary Club of Surat',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        startTime: '10:00 AM',
        endTime: '04:00 PM',
        venue: 'Community Hall, Adajan Gam',
        city: 'Surat',
        pincode: '395009',
        contactPhone: '9876540002',
        targetUnits: 150,
      },
    ]);

    // Appointments
    await Appointment.create([
      {
        donor: donors[0]._id,
        donorUser: donors[0].user,
        bloodBank: bloodBanks[0]._id,
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        timeSlot: '10:00 AM - 11:00 AM',
        bloodGroup: 'A+',
        status: 'Scheduled',
      },
      {
        donor: donors[1]._id,
        donorUser: donors[1].user,
        bloodBank: bloodBanks[1]._id,
        appointmentDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        timeSlot: '02:00 PM - 03:00 PM',
        bloodGroup: 'B+',
        status: 'Scheduled',
      },
    ]);

    // Initial Chat message
    await Chat.create({
      sender: hospUser._id,
      senderName: 'Civil Hospital Surat',
      senderRole: 'hospital',
      recipient: bloodBanks[0].user,
      recipientName: 'Surat City Blood Bank',
      recipientRole: 'bloodbank',
      message: 'Hello, we require urgent 2 units of B+ blood for an emergency surgery.',
      conversationId: [hospUser._id.toString(), bloodBanks[0].user.toString()].sort().join('_'),
    });

    console.log('[Seed] Data seeded successfully!');
    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Error]:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedData(true);
}
