// netlify/functions/proxy.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { endpoint, id, challenge_id, challenge_solution } = event.queryStringParameters || {};

    let url;
    if (endpoint === 'challenge') {
      url = 'https://twittermedia.b-cdn.net/challenge/';
    } else if (endpoint === 'x-id') {
      url = `https://twittermedia.b-cdn.net/x-id/?id=${encodeURIComponent(id)}&challenge_id=${challenge_id}&challenge_solution=${challenge_solution}`;
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid endpoint' })
      };
    }

    const response = await fetch(url, {
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'origin': 'https://snaplytics.io',
        'referer': 'https://snaplytics.io/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers,
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
