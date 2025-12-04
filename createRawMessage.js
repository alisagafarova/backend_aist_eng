function createRawMessage(from, to, subject, body) {
  const message = [`From: ${from}`, `To: ${to}`, `Subject: ${subject}`, '', body].join('\n');
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

export { createRawMessage };
