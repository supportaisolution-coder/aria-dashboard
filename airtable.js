const AT_TOKEN = 'patRzWm2Wxs0uavRz.c493f0fe2d18c97b571840a3ac6b94387805fc50bace31d1de70b99ebb00e01e';
const BASE_ID = 'app5AHCbLeGUvSpq2';

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };

  try {
    const p = event.queryStringParameters || {};
    const table = p.table;
    const id = p.id || '';
    if (!table) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'table required' }) };

    let url = `https://api.airtable.com/v0/${BASE_ID}/${table}${id ? '/' + id : ''}`;

    if (event.httpMethod === 'GET') {
      const q = Object.entries(p).filter(([k]) => k !== 'table' && k !== 'id').map(([k,v]) => `${k}=${encodeURIComponent(v)}`);
      if (q.length) url += '?' + q.join('&');
    }

    const opts = {
      method: event.httpMethod,
      headers: { 'Authorization': `Bearer ${AT_TOKEN}`, 'Content-Type': 'application/json' }
    };
    if (event.body && ['POST','PATCH','PUT'].includes(event.httpMethod)) opts.body = event.body;

    const res = await fetch(url, opts);
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { error: text.slice(0, 200) }; }

    return { statusCode: res.status, headers: cors, body: JSON.stringify(data) };
  } catch(e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message }) };
  }
};
