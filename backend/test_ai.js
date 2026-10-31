

async function test() {
  try {
    const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an AI' },
            { role: 'user', content: 'Say hello' }
          ]
        })
      });
      const text = await res.text();
      console.log("RESPONSE:", text);
  } catch(e) {
      console.error(e);
  }
}

test();
