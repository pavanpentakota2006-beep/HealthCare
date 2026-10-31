const BASE = 'http://localhost:4001';

async function run() {
  // 1. Register
  let res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'healthcheck@hv.ai', password: 'Test1234!', role: 'USER' })
  });
  let data = await res.json();
  console.log('REGISTER:', JSON.stringify(data));

  // 2. Login
  res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'healthcheck@hv.ai', password: 'Health1234!' })
  });
  data = await res.json();
  if (!data.access_token) {
    res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'healthcheck@hv.ai', password: 'Test1234!' })
    });
    data = await res.json();
  }
  const token = data.access_token;
  console.log('LOGIN TOKEN:', token ? '✅ Got token' : '❌ No token', '| User:', JSON.stringify(data.user));

  if (!token) { console.log('Stopping - no token'); return; }

  const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  // 3. Sync health data
  res = await fetch(`${BASE}/health/sync`, { headers: authHeaders });
  data = await res.json();
  console.log('HEALTH SYNC:', res.status === 200 ? '✅' : '❌', res.status);

  // 4. AI Chat
  res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST', headers: authHeaders,
    body: JSON.stringify({ message: 'give me one quick diet tip' })
  });
  data = await res.json();
  console.log('AI CHAT:', res.status === 200 || res.status === 201 ? '✅' : '❌', '| Reply snippet:', data.reply?.slice(0, 80));

  // 5. Products
  res = await fetch(`${BASE}/commerce/products`, { headers: authHeaders });
  data = await res.json();
  console.log('PRODUCTS:', res.ok ? '✅' : '❌', '| Count:', Array.isArray(data) ? data.length : data);

  // 6. Community posts
  res = await fetch(`${BASE}/community/posts`, { headers: authHeaders });
  data = await res.json();
  console.log('COMMUNITY POSTS:', res.ok ? '✅' : '❌', '| Count:', Array.isArray(data) ? data.length : data);

  // 7. Gamification
  res = await fetch(`${BASE}/gamification/progress`, { headers: authHeaders });
  data = await res.json();
  console.log('GAMIFICATION PROGRESS:', res.ok ? '✅' : '❌', '| Challenges:', data.challenges?.length, 'Badges:', data.badges?.length);

  // 8. Challenges
  res = await fetch(`${BASE}/gamification/challenges`, { headers: authHeaders });
  data = await res.json();
  console.log('CHALLENGES:', res.ok ? '✅' : '❌', '| Count:', Array.isArray(data) ? data.length : data);

  // 9. Telemedicine Doctors
  res = await fetch(`${BASE}/telemedicine/doctors`, { headers: authHeaders });
  data = await res.json();
  console.log('DOCTORS:', res.ok ? '✅' : '❌', '| Count:', Array.isArray(data) ? data.length : data);

  console.log('\n🎉 Full health check complete!');
}

run().catch(console.error);
