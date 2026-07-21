import type { MembershipPlan } from '../types';

// ============================================================
// TODO: Replace all 'price' values with your actual prices
// TODO: Replace all 'features' with your actual inclusions
// ============================================================

export const BOXING_PLANS: MembershipPlan[] = [
  {
    id: 'boxing-monthly',
    gym: 'boxing',
    name: 'Monthly',
    duration: 'monthly',
    durationDays: 30,
    price: 1200, // TODO: Replace with actual price
    features: [
      "Unlimited gym access",
      "All boxing equipment",
      "AC + music included",
      "Group classes included",
      "Save vs monthly",
    ],
    isPersonalTraining: false,
  },
  {
    id: 'boxing-3month',
    gym: 'boxing',
    name: '3 Months',
    duration: '3month',
    durationDays: 90,
    price: 3300, // TODO: Replace with actual price
    features: [
      "Unlimited gym access",
      "All boxing equipment",
      "AC + music included",
      "Group classes included",
      "Save vs monthly",
    ],
    isPersonalTraining: false,
    highlight: true,
  },
  {
    id: 'boxing-6month',
    gym: 'boxing',
    name: '6 Months',
    duration: '6month',
    durationDays: 180,
    price: 6500, // TODO: Replace with actual price
    features: [
      "Unlimited gym access",
      "All boxing equipment",
      "AC + music included",
      "Group classes included",
      "Save vs monthly",
    ],
    isPersonalTraining: false,
  },
  {
    id: 'boxing-annual',
    gym: 'boxing',
    name: 'Annual',
    duration: 'annual',
    durationDays: 365,
    price: 10000, // TODO: Replace with actual price
    features: [
      "Unlimited gym access",
      "All boxing equipment",
      "AC + music included",
      "Group classes included",
      "Best value",
    ],
    isPersonalTraining: false,
  },
  {
    id: 'boxing-pt',
    gym: 'boxing',
    name: 'Personal Training',
    duration: 'monthly',
    durationDays: 30,
    price: 7000, // TODO: Replace with actual price
    features: [
      'Everything in Monthly',
      '1-on-1 coaching with the Coach',
      'Custom training program',
      'Diet guidance',
      'Progress tracking',
    ],
    isPersonalTraining: true,
  },
];

export const NISHA_PLANS: MembershipPlan[] = [
  {
    id: 'nisha-monthly',
    gym: 'nisha',
    name: 'Monthly',
    duration: 'monthly',
    durationDays: 30,
    price: 1200, // TODO: Replace with actual price
    features: [
      'Unlimited gym access',
      'All cardio machines',
      'All resistance machines',
      'AC + music included',
      'Women-only floor',
    ],
    isPersonalTraining: false,
  },
  {
    id: 'nisha-3month',
    gym: 'nisha',
    name: '3 Months',
    duration: '3month',
    durationDays: 90,
    price: 3300, // TODO: Replace with actual price
    features: [
      'Unlimited gym access',
      'All machines',
      'AC + music included',
      'Women-only floor',
      'Save vs monthly',
    ],
    isPersonalTraining: false,
    highlight: true,
  },
  {
    id: 'nisha-6month',
    gym: 'nisha',
    name: '6 Months',
    duration: '6month',
    durationDays: 180,
    price: 6500, // TODO: Replace with actual price
    features: [
      'Unlimited gym access',
      'All machines',
      'AC + music included',
      'Women-only floor',
      'Best value',
    ],
    isPersonalTraining: false,
  },
  {
    id: 'nisha-annual',
    gym: 'nisha',
    name: 'Annual',
    duration: 'annual',
    durationDays: 365,
    price: 10000, // TODO: Replace with actual price
    features: [
      'Unlimited gym access',
      'All machines',
      'AC + music included',
      'Women-only floor',
      'Maximum savings',
    ],
    isPersonalTraining: false,
  },
  {
    id: 'nisha-pt',
    gym: 'nisha',
    name: 'Personal Training',
    duration: 'monthly',
    durationDays: 30,
    price: 5000, // TODO: Replace with actual price
    features: [
      'Everything in Monthly',
      '1-on-1 personal trainer',
      'Custom workout plan',
      'Nutrition guidance',
      'Body measurement tracking',
    ],
    isPersonalTraining: true,
  },
];

// Equipment lists — TODO: Replace with actual equipment names
export const BOXING_EQUIPMENT = [
  // ── Boxing specific ──────────────────────────────────────────
  {
    name: 'Professional Boxing Ring',
    description: 'Full-size professional boxing ring for sparring and competitive training sessions under coach supervision.',
    imageUrl: '/images/boxing/boxing-ring.jpeg',
    // TODO: replace with → '/images/boxing/boxing-ring.jpg'
    category: 'boxing',
  },
  {
    name: 'Heavy Punching Bags',
    description: 'Multiple heavy bags of varying weights for building knockout power and endurance.',
    imageUrl: '/images/boxing/heavy-bags.jpeg',
    // TODO: replace with → '/images/boxing/heavy-bags.jpg'
    category: 'boxing',
  },
{
  name: 'Focus Mitts & Punch Pads',
  description: 'Professional focus mitts and punch pads for precision training and coach-guided combinations.',
  imageUrl: '/images/boxing/focus-mitts.jpeg',
  category: 'boxing',
},
  {
    name: 'Double-End Bags',
    description: 'Double-end bags for developing accuracy, reflexes and defensive movement.',
    imageUrl: '/images/boxing/double-end-bag.jpeg',
    // TODO: replace with → '/images/boxing/double-end-bag.jpg'
    category: 'boxing',
  },
    {
    name: 'USI body protector / chest guard',
    description: 'Body protector for safe sparring sessions, allowing boxers to train with full contact while minimizing injury risk.',
    imageUrl: '/images/boxing/body-protector.jpeg',
    // TODO: replace with → '/images/boxing/double-end-bag.jpg'
    category: 'boxing',
  },
  // ── Mechanical strength machines ─────────────────────────────
  {
    name: 'Lat Pulldown',
    description: 'Mechanical cable machine for building a wider back and stronger lats — essential for punch power.',
    imageUrl: '/images/boxing/lat-pulldown.jpeg',
    // TODO: replace with → '/images/boxing/lat-pulldown.jpg'
    category: 'machine',
  },
  {
    name: 'Seated Cable Row',
    description: 'Targets the mid-back, rhomboids and biceps for a strong pulling foundation.',
    imageUrl: '/images/boxing/seated-row.jpeg',
    // TODO: replace with → '/images/boxing/seated-row.jpg'
    category: 'machine',
  },
  {
    name: 'Pec Deck Fly',
    description: 'Isolates chest muscles for improved pressing strength and upper body power.',
    imageUrl: '/images/boxing/pec-deck.jpeg',
    // TODO: replace with → '/images/boxing/pec-deck.jpg'
    category: 'machine',
  },
  {
    name: 'Smith Machine',
    description: 'Guided barbell machine for safe squats, presses and full-body compound movements.',
    imageUrl: '/images/boxing/smith-machine.jpeg',
    // TODO: replace with → '/images/boxing/smith-machine.jpg'
    category: 'machine',
  },
  {
    name: 'Leg Press',
    description: 'Build explosive leg power — the foundation of footwork, stance and knockout force.',
    imageUrl: '/images/boxing/leg-press.jpeg',
    // TODO: replace with → '/images/boxing/leg-press.jpg'
    category: 'machine',
  },

  {
    name: 'Dumbbells & wieght plates',
    description: 'Full range of dumbbells and weight plates for isolation work, conditioning circuits and functional strength.',
    imageUrl: '/images/boxing/dumbbells.jpeg',
    // TODO: replace with → '/images/boxing/dumbbells.jpg'
    category: 'machine',
  },

];

export const NISHA_EQUIPMENT = [
  // ── Cardio ───────────────────────────────────────────────────
  {
    name: 'Full-Size Treadmill',
    description: 'Commercial-grade treadmills for all fitness levels — walking, jogging or running.',
    imageUrl: '/images/Nisha/treadmill.jpeg',
    // TODO: replace with → '/images/nisha/treadmill.jpg'
    category: 'cardio',
  },
  // ── Strength machines ────────────────────────────────────────
  {
    name: 'Lat Pulldown',
    description: 'Targets upper back and lats for a stronger, more defined back.',
    imageUrl: '/images/Nisha/lat-pulldown.jpeg',
    // TODO: replace with → '/images/nisha/lat-pulldown.jpg'
    category: 'machine',
  },
  {
    name: 'Pec Deck Fly',
    description: 'Sculpts and tones the chest with a controlled, safe range of motion.',
    imageUrl: '/images/Nisha/peckdecfly.jpeg',
    // TODO: replace with → '/images/nisha/pec-deck.jpg'
    category: 'machine',
  },
  {
    name: 'Leg Press',
    description: 'Strengthens quads, glutes and hamstrings — great for toning legs.',
    imageUrl: '/images/Nisha/leg press.jpeg',
    // TODO: replace with → '/images/nisha/leg-press.jpg'
    category: 'machine',
  },
  {
    name: 'Leg Curl / Extension',
    description: 'Dual-function machine to isolate hamstrings and quads for balanced leg development.',
    imageUrl: '/images/Nisha/legcurl.jpeg',
    // TODO: replace with → '/images/nisha/leg-curl.jpg'
    category: 'machine',
  },
  {
    name: 'Bench Press',
    description: 'Build upper body strength and tone chest, shoulders and triceps.',
    imageUrl: '/images/Nisha/benchpress.jpeg',
    // TODO: replace with → '/images/nisha/bench-press.jpg'
    category: 'machine',
  },
    {
    name: 'Crossfit Machine',
    description: 'Full-body functional training machine combining cardio and strength for high-intensity workouts.',
    imageUrl: '/images/Nisha/crossfit.jpeg',
    // TODO: replace with → '/images/nisha/crossfit.jpg'
    category: 'cardio',
  },
      {
    name: 'Cycle Machine',
    description: 'Full-body functional training machine combining cardio and strength for high-intensity workouts.',
    imageUrl: '/images/Nisha/cycles.jpeg',
    // TODO: replace with → '/images/nisha/cycle.jpg'
    category: 'cardio',
  },
  {
    name: 'Back Hyperextension',
    description: 'Strengthens lower back, glutes and core — essential for posture and spine health.',
    imageUrl: '/images/Nisha/backhyper.jpeg',
    // TODO: replace with → '/images/nisha/back-hyperextension.jpg'
    category: 'machine',
  },
  {
    name: 'Abdominal Bench',
    description: 'Dedicated ab bench for effective core strengthening and stomach toning.',
    imageUrl: '/images/Nisha/abdom.jpeg',
    // TODO: replace with → '/images/nisha/ab-bench.jpg'
    category: 'machine',
  },
  {
    name: 'Parallel Bar Dips',
    description: 'Bodyweight station for triceps, chest and shoulder strength and definition.',
    imageUrl: '/images/Nisha/parellelbar.jpeg',
    // TODO: replace with → '/images/nisha/parallel-bars.jpg'
    category: 'machine',
  },
  // ── Free weights ─────────────────────────────────────────────
  {
    name: 'Dumbbells',
    description: 'Full range of dumbbells for curls, shoulder work and full-body toning circuits.',
    imageUrl: '/images/Nisha/dumbell.jpeg',
    // TODO: replace with → '/images/nisha/dumbbells.jpg'
    category: 'freeweight',
  },
  
];
// Contact info — TODO: Replace with real details


export const SHARED_CONTACT = {
  phone:        '8630526682',           // e.g. 9876543210
  whatsappNumber: '918630526682',                   // e.g. 919876543210 (no + sign)
  address:      'Fitness first boxing club behind hotel godawari , Asaf Nagar , Roorkee , Uttarakhand 247667',
  mapEmbedUrl:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d849.9578802596805!2d77.87828228864527!3d29.823367931320032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390eb3ca51b4bad3%3A0x93eb48e69fa65cd4!2sNaveen%20Boxing%20Academy%20Roorkee!5e1!3m2!1sen!2sin!4v1781079176938!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
  upiId:        '8630526682@ptsbi', 
    instagram: 'https://www.instagram.com/boxing_guru_ji/',
    facebook: 'https://www.facebook.com/share/1LmZ8T6KeF/?mibextid=wwXIfr',
    youtube: 'https://www.youtube.com/@Boxingguruji',
};

export const GYM_UPI = {
  boxing: {
    upiId:  '8630526682@ptsbi',
    qrPath: '/images/boxing/qr.jpeg',
  },
  nisha: {
    upiId:  '7310961354@ptyes',
    qrPath: '/images/Nisha/upi.jpeg',
  },
};
export const NOTIFY_WHATSAPP = {
  boxing: import.meta.env.VITE_BOXING_NOTIFY_WHATSAPP || '',
  nisha:  import.meta.env.VITE_NISHA_NOTIFY_WHATSAPP  || '',
};

export const GYM_CONTACT = {
  boxing: {
    ...SHARED_CONTACT,
    timings: {
      monday:    { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' }, // TODO: confirm
      tuesday:   { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' },
      wednesday: { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' },
      thursday:  { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' },
      friday:    { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' },
      saturday:  { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' },                    // TODO: confirm
      sunday:    { open: false, hours: 'Closed' },
    },
  },
  nisha: {
    ...SHARED_CONTACT,
    timings: {
      monday:    { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' }, // TODO: confirm
      tuesday:   { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' },
      wednesday: { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' },
      thursday:  { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' },
      friday:    { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' },
      saturday:  { open: true,  hours: '6:30 AM – 8:30 AM, 5:00 PM – 8:00 PM' },                    // TODO: confirm
      sunday:    { open: false, hours: 'Closed' },
    },
  },
};

// ── FAQ DATA ─────────────────────────────────────────────────

export const BOXING_FAQS = [
  {
    q: 'What should I bring on day one?',
    a: 'Bring a water bottle, hand wraps, and boxing gloves. We do not provide these — you need to bring your own.',
  },
  {
    q: 'Is there a free trial session?',
    a: 'No, we do not offer free trials. You can visit the gym to see it before joining, but training sessions require a paid membership.',
  },
  {
    q: 'What is the minimum age to join?',
    a: 'We train members aged 7 years and above.',
  },

  {
    q: 'Do I need prior boxing experience?',
    a: 'No. We train complete beginners as well as experienced fighters. The coach tailors the training to your level.',
  },
  {
    q: 'Are women allowed to train here?',
    a: 'Yes, women are welcome at Fitness First Boxing Club.',
  },
  {
    q: 'Can I pause or hold my membership?',
    a: 'Contact us on WhatsApp to discuss holds due to injury or travel.',
  },
  {
    q: 'If I join mid-month, when does my plan start?',
    a: 'Your plan starts from the day you join and runs for the full duration from that date.',
  },
];

export const NISHA_FAQS = [
  {
    q: 'Is this gym strictly women only?',
    a: 'Yes. Nisha Fitness is a 100% women-only space. No male visitors or trainers.',
  },
  {
    q: 'Is there a free trial session?',
    a: 'No, we do not offer free trials. You are welcome to visit and see the gym before joining.',
  },
  {
    q: 'What is the minimum age to join?',
    a: 'We welcome members aged 7 years and above.',
  },
  
  {
    q: 'Is there a personal trainer available?',
    a: 'Yes, personal training is available at an additional charge. See our Personal Training plan.',
  },
  {
    q: 'Is this gym suitable for complete beginners?',
    a: 'Absolutely. Nisha Fitness is welcoming to all fitness levels — no prior experience needed.',
  },
  {
    q: 'What equipment is available?',
    a: 'Treadmills, crossfit machine, lat pulldown, pec deck fly, leg press, leg curl/extension, bench press, back hyperextension, abdominal bench, parallel bar dips, dumbbells and weight plates.',
  },
  {
    q: 'If I join mid-month, when does my plan start?',
    a: 'Your plan starts from the day you join and runs for the full duration from that date.',
  },
];

