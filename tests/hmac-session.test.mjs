import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createHmacSessionResolver } from '../src/server/hmac-session.mjs';

const secret = 'test-only-high-entropy-secret-not-for-production-123';
const userId = '33333333-3333-4333-8333-333333333333';
const now = () => 1800000000;
const config = { secret, issuer: 'mercadinho-auth', audience: 'mercadinho-api', now };
function sign(payload, header={alg:'HS256',typ:'JWT'}, key=secret) {
  const body = [header,payload].map(v=>Buffer.from(JSON.stringify(v)).toString('base64url')).join('.');
  return body+'.'+createHmac('sha256',key).update(body).digest('base64url');
}
const claims = { iss:config.issuer, aud:config.audience, sub:userId, iat:1799999900, exp:1800000100 };
const req = token => ({ headers: { authorization: 'Bearer '+token } });

test('verifies signature and returns only trusted internal user ID', async () => {
  const resolve = createHmacSessionResolver(config);
  assert.deepEqual(await resolve(req(sign(claims))), { verified:true, userId });
});
test('rejects unsigned, wrong key, wrong algorithm and tampering', async () => {
  const resolve = createHmacSessionResolver(config);
  for (const token of [sign(claims,{alg:'none'}),sign(claims,undefined,'wrong-secret'),sign({...claims,sub:'not-a-uuid'}),sign({...claims,exp:1800000001}).replace(/^./, 'X')]) {
    await assert.rejects(resolve(req(token)));
  }
});
test('rejects wrong issuer, audience, expiry and future issuance', async () => {
  const resolve = createHmacSessionResolver(config);
  for (const altered of [{iss:'other'},{aud:'other'},{exp:1800000000},{iat:1800000001},{nbf:1800000001},{exp:1800004000},{iat:1800000050,exp:1800000020}]) {
    await assert.rejects(resolve(req(sign({...claims,...altered}))));
  }
});
test('requires server config and authorization header', async () => {
  assert.throws(()=>createHmacSessionResolver({...config,secret:'short'}));
  await assert.rejects(createHmacSessionResolver(config)({headers:{}}));
});

test('rejects malformed token, unexpected headers and invalid claims', async () => {
  const resolve = createHmacSessionResolver(config);
  for (const token of [
    'not-a-token',
    sign(claims,{alg:'HS256',kid:'untrusted-key'}),
    sign(claims,{alg:'HS256',crit:['exp']}),
    sign({...claims,iat:1799990000}),
    sign({...claims,nbf:'tomorrow'}),
    sign({...claims,exp:'1800000100'}),
  ]) {
    await assert.rejects(resolve(req(token)));
  }
});

test('rejects JWT with an array header', async () => {
  const resolve = createHmacSessionResolver(config);
  await assert.rejects(resolve(req(sign(claims, ['HS256']))));
});

test('rejects malformed signatures and noncanonical base64url segments', async () => {
  const resolve = createHmacSessionResolver(config);
  const valid = sign(claims);
  const [header, payload, signature] = valid.split('.');
  for (const token of [
    [header, payload, 'invalid'].join('.'),
    [header, payload, signature + '='].join('.'),
    [header + '=', payload, signature].join('.'),
    [header, payload + '=', signature].join('.'),
    [header, payload, ''].join('.'),
  ]) {
    await assert.rejects(resolve(req(token)));
  }
});
